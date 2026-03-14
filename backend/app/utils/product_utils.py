# app/utils/product_utils.py
from app.models.product import Product
import pandas as pd
import math

def get_unique_product_words(ids):
    """
    Mengambil produk berdasarkan list of IDs, mengekstrak namanya,
    memecahnya berdasarkan kata (spasi), dan menghilangkan duplikat.
    """
    # Get products by ids
    products = Product.query.filter(Product.id.in_(ids)).all()
    
    # Extract product name to array separate by white space
    product_names = []
    for product in products:
        if product.name:
            product_names.append(product.name.split())

    # Join into single array
    product_names_join = [item for sublist in product_names for item in sublist]

    # Remove duplicate
    product_names_unique = list(dict.fromkeys(product_names_join))
    
    return product_names, product_names_join, product_names_unique

class SkincarePreprocessor:
    @staticmethod
    def process_text_tfidf(series, use_log=False, product_num_prefix="P", names=None):
        """Generic TF-IDF logic ported from notebook."""
        text_split = [str(x).split() for x in series]
        text_split_join = [item for sublist in text_split for item in sublist]
        text_unique = sorted(list(dict.fromkeys(text_split_join)))
        
        # Determine names to show in 'Product Name' column
        display_names = names if names is not None else series

        # DataFrame for counts
        all_columns = ['Product Number', 'Product Name'] + text_unique + ['Total']
        df_counts = pd.DataFrame(columns=all_columns)
        total_each = []

        for i, split_list in enumerate(text_split):
            original_val = display_names.iloc[i]
            numbering = f"{product_num_prefix}{i+1}"
            counts = [split_list.count(item) for item in text_unique]
            total = sum(counts)
            counts.append(total)
            total_each.append([original_val, total])
            df_counts.loc[len(df_counts)] = [numbering, original_val] + counts

        # IDF
        sum_numeric = df_counts.sum(numeric_only=True, axis=0)
        list_idf = len(series) / sum_numeric
        if use_log:
            list_idf = list_idf.apply(lambda x: math.log10(x) if x > 0 else 0)
        
        # Term Frequency
        df_tf = pd.DataFrame(columns=['Product Number', 'Product Name'] + text_unique)
        for i, split_list in enumerate(text_split):
            original_val = series.iloc[i]
            numbering = f"{product_num_prefix}{i+1}"
            total_words = total_each[i][1]
            counts = [(split_list.count(item) / total_words) if total_words > 0 else 0 for item in text_unique]
            df_tf.loc[len(df_tf)] = [numbering, original_val] + counts
        
        # TF-IDF
        df_tfidf = df_tf.copy()
        for column in text_unique:
            if column in list_idf.index:
                df_tfidf[column] = df_tfidf[column] * list_idf[column]
                
        return df_counts, df_tf, df_tfidf, list_idf

    @staticmethod
    def process_category(series, product_num_prefix="P"):
        """Category preprocessing logic."""
        cat_split = [str(x).split() for x in series]
        cat_unique = sorted(list(dict.fromkeys([item for sublist in cat_split for item in sublist])))
        
        all_columns = ['Category Number', 'Category Name'] + cat_unique + ['Total']
        df_cat = pd.DataFrame(columns=all_columns)
        for i, split_list in enumerate(cat_split):
            original_val = series.iloc[i]
            numbering = f"{product_num_prefix}{i+1}"
            counts = [split_list.count(item) for item in cat_unique]
            total = sum(counts)
            counts.append(total)
            df_cat.loc[len(df_cat)] = [numbering, original_val] + counts
        return df_cat

    @staticmethod
    def normalize_numeric(df, column_name):
        """Min-Max normalization logic."""
        df_norm = df[['name', column_name]].copy()
        min_val = df_norm[column_name].min()
        max_val = df_norm[column_name].max()
        
        col_new = f'normalized_{column_name.lower()}'
        if (max_val - min_val) != 0:
            df_norm[col_new] = (df_norm[column_name] - min_val) / (max_val - min_val)
        else:
            df_norm[col_new] = 0.0
        return df_norm

    @staticmethod
    def pivot_tfidf(df_tfidf, type_name):
        """Pivoting logic from notebook."""
        df_pivoted = df_tfidf.copy()
        # The notebook uses 'Product Number' + 'Product Name' or similar
        id_col = f'{type_name} Number' if f'{type_name} Number' in df_pivoted.columns else 'Product Number'
        name_col = f'{type_name} Name' if f'{type_name} Name' in df_pivoted.columns else 'Product Name'
        
        df_pivoted['Identifier'] = df_pivoted[id_col].astype(str) + ' - ' + df_pivoted[name_col].astype(str)
        df_res = df_pivoted.set_index('Identifier')
        
        # Drop the original id and name columns so only terms remain
        df_res = df_res.drop(columns=[id_col, name_col])
        
        df_res = df_res.T
        df_res.index.name = 'Term'
        return df_res

    @staticmethod
    def get_merged_tfidf_matrix(df):
        """Unified logic to get the merged vertical matrix of all TF-IDF features."""
        _, _, tfidf_name, _ = SkincarePreprocessor.process_text_tfidf(df['name'], use_log=False, names=df['name'])
        _, _, tfidf_ingred, _ = SkincarePreprocessor.process_text_tfidf(df['ingredients'], use_log=False, names=df['name'])
        _, _, tfidf_brand, _ = SkincarePreprocessor.process_text_tfidf(df['brand'], use_log=True, names=df['name'])
        _, _, tfidf_shades, _ = SkincarePreprocessor.process_text_tfidf(df['shades'], use_log=True, names=df['name'])
        
        # Pivot
        p_name = SkincarePreprocessor.pivot_tfidf(tfidf_name, "Product").reset_index()
        p_name['Group'] = 'Product'
        
        p_ingred = SkincarePreprocessor.pivot_tfidf(tfidf_ingred, "Product").reset_index()
        p_ingred['Group'] = 'Ingredient'
        
        p_brand = SkincarePreprocessor.pivot_tfidf(tfidf_brand, "Product").reset_index()
        p_brand['Group'] = 'Brand'
        
        p_shades = SkincarePreprocessor.pivot_tfidf(tfidf_shades, "Product").reset_index()
        p_shades['Group'] = 'Shade'
        
        # Merge (Vertical stack like notebook)
        merged = pd.concat([p_name, p_brand, p_shades, p_ingred], ignore_index=True)
        return merged
