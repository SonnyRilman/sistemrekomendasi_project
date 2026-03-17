from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.common.exceptions import (
    TimeoutException,
    NoSuchElementException,
    StaleElementReferenceException,
)
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import ElementClickInterceptedException
import time
import os
import xlsxwriter
import pandas as pd

opts = Options()
# Opsi wajib untuk mengurangi deteksi sebagai bot
opts.add_argument("--no-sandbox")
opts.add_argument("--disable-dev-shm-usage")
opts.add_argument("--disable-blink-features=AutomationControlled")
opts.add_experimental_option("excludeSwitches", ["enable-automation"])
opts.add_experimental_option("useAutomationExtension", False)
# Block Chrome notification pop-up
prefs = {"profile.default_content_setting_values.notifications": 2}
opts.add_experimental_option("prefs", prefs)

# Fake user-agent agar terlihat seperti browser biasa
opts.add_argument(
    "user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/120.0.0.0 Safari/537.36"
)

class Config:
    BASE_URL = "https://www.sociolla.com"
    LOAD_TIMEOUT = 5

def check_banner_iklan(driver) -> bool:
    id_banner_iklan = "#modal-close"
    try:
        WebDriverWait(driver, Config.LOAD_TIMEOUT).until(
            EC.presence_of_element_located(
                (By.CSS_SELECTOR, id_banner_iklan)
            )
        )
        print("Element", id_banner_iklan, "ditemukan.")
        return True
    except (NoSuchElementException, TimeoutException):
        print("Element", id_banner_iklan, "tidak ditemukan.")
        return False
    
def ambil_category(driver) -> list[dict]:
    categories = []

    # Setelah banner iklan ditutup, cari element dengan id havemenu dan class sub-menu-item
    print("Mengumpulkan category...")
    id_havemenu = "#havemenu"

    try:
        # Tunggu sampai havemenu muncul
        print("Menunggu havemenu muncul...")
        WebDriverWait(driver, Config.LOAD_TIMEOUT).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, id_havemenu))
        )
        print("havemenu muncul")
        havemenu = driver.find_elements(By.CSS_SELECTOR, id_havemenu)

        # jika ada sub_menu_items, maka cari element a dengan title "Categories". Jika ada maka hentikan looping, lalu hover element tersebut
        if havemenu:
            for sub_menu_item in havemenu:
                a = sub_menu_item.find_element(By.TAG_NAME, "a")
                if a.get_attribute("title") == "Categories":
                    print("Element Categories ditemukan. Lakukan klik atau hover!")
                    sub_menu_item.click()
                    
                    # Menunggu .overlay-menu muncul
                    print("Menunggu .overlay-menu muncul...")
                    WebDriverWait(driver, Config.LOAD_TIMEOUT).until(
                        EC.presence_of_element_located(
                            (By.CSS_SELECTOR, ".overlay-menu")
                        )
                    )
                    print(".overlay-menu muncul")

                    # Hover ke element dengan class .overlay-menu
                    overlay_menu = driver.find_element(By.CSS_SELECTOR, ".overlay-menu")
                    parrent_list_item = overlay_menu.find_elements(By.CSS_SELECTOR, ".parrent-list-item")
                    print(".overlay-menu muncul dan parrent-list-item ditemukan!")

                    # Loop parrent-list-item, temukan element a, lalu ambil attribute href-nya
                    print("Mengumpulkan categories...")
                    for parrent in parrent_list_item:
                        a = parrent.find_element(By.TAG_NAME, "a")
                        href = a.get_attribute("href")
                        text = a.find_element(By.TAG_NAME, "p").text
                        categories.append({"Category Name": text, "Category Link": href})
                    
                    print("Lopping selesai. ditemukan", len(categories), "categories")
                    break
        return categories
    except Exception as e:
        print("Error:", e)
        return categories
    
def scrap_produk_utama(driver, jumlah_target):
    produk_set = set()
    produk_list = []
    iterasi_ke = 0

    print("Scraping produk utama...")
    while len(produk_list) < jumlah_target:

        # Ambil semua card produk yang sudah muncul
        print("Menemukan produk container...")
        WebDriverWait(driver, Config.LOAD_TIMEOUT).until(
            EC.presence_of_element_located(
                (By.CSS_SELECTOR, ".vertical-list-container")
            )
        )
        product_container = driver.find_element(By.CSS_SELECTOR, ".vertical-list-container")
        print("Produk container ditemukan!")
        products = product_container.find_elements(By.TAG_NAME, "li")
        print(f"Menemukan {len(products)} produk.")


        total_error = 0
        max_error = 2
        for index, product in enumerate(products):
            close_ins_popup(driver)
            if total_error >= max_error:
                break

            if iterasi_ke == index: 
                try:
                    iterasi_ke += 1
                    print(f"Scraping produk ke-{iterasi_ke}... loop ke-{index}")
                    WebDriverWait(product, Config.LOAD_TIMEOUT).until(
                        EC.presence_of_element_located(
                            (By.TAG_NAME, "a")
                        )
                    )
                    link_elem = product.find_element(By.TAG_NAME, "a")
                    nama = link_elem.find_element(By.CSS_SELECTOR, ".product-name").text
                    brand = link_elem.find_element(By.CSS_SELECTOR, ".product-brand").text

                    # Jika tidak ada final price maka price = 0
                    if not link_elem.find_elements(By.CSS_SELECTOR, ".final-price"):
                        price = 0
                    else:
                        price = link_elem.find_element(By.CSS_SELECTOR, ".final-price").text

                    # Check apakah element rating ada
                    if not link_elem.find_elements(By.CSS_SELECTOR, ".rating-value"):
                        rating = 0
                    else:
                        rating = link_elem.find_element(By.CSS_SELECTOR, ".rating-value").text

                    link = link_elem.get_attribute("href")

                    if link not in produk_set:
                        produk_set.add(link)

                        if price == 0:
                            continue
                        else:
                            # Hanya ambil produk dengan harga > 0
                            produk_list.append({
                                "link": link,
                                "nama": nama,
                                "brand": brand,
                                "price": price,
                                "rating": rating
                            })
                    if len(produk_list) >= jumlah_target:
                        break
                except Exception as e:
                    print("Gagal scrap card:", e)
                    total_error += 1
                    continue  # lanjut ke produk berikutnya, jangan break
                else:
                    continue  # lanjut ke produk berikutnya

        # Klik tombol load more jika masih butuh produk
        if len(produk_list) < jumlah_target and total_error < max_error:
            close_ins_popup(driver)

            try:
                load_more = driver.find_element(By.CSS_SELECTOR, ".button-load-more")
                # Scroll ke tengah layar
                driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", load_more)
                # Tunggu tombol bisa diklik
                WebDriverWait(driver, 10).until(
                    EC.element_to_be_clickable((By.CSS_SELECTOR, ".button-load-more"))
                )
                load_more.click()
                print("Klik tombol Load More...")
                time.sleep(5)  # beri jeda agar produk baru muncul
            except Exception as e:
                print("Tidak bisa klik Load More atau sudah habis:", e)

                # Check apakah error ini karena pop up ins-preview-wrapper muncul
                if "ins-responsive-pick-a-gift__gift-box-red" in str(e):
                    close_ins_popup(driver)
                    continue
                else:
                    break
    return produk_list

def scrap_detail_produk(driver, produk_list):
    detail_list = []
    error = 0
    max_error = 50
    for produk in produk_list:
        try:
            if produk["brand"] == "SOCIOLLA":
                continue

            driver.get(produk["link"])
            print(f"Scraping detail: {produk['nama']}")
            time.sleep(2)

            # Contoh: ambil deskripsi produk
            WebDriverWait(driver, Config.LOAD_TIMEOUT).until(
                EC.presence_of_element_located(
                    (By.CSS_SELECTOR, "#product-description-usage")
                )
            )
            if driver.find_elements(By.CSS_SELECTOR, "#product-description-usage"):
                tabs = driver.find_elements(By.CSS_SELECTOR, ".tabs-description li")

                for tab in tabs:
                    p = tab.find_element(By.TAG_NAME, "p")

                    if p.text == "Kandungan":
                        print("menemukan element kandungan")
                        time.sleep(2)
                        tab.click()

                        # Sekarang ambil element tab-detail
                        WebDriverWait(driver, Config.LOAD_TIMEOUT).until(
                            EC.presence_of_element_located(
                                (By.CSS_SELECTOR, "#product-description-usage .tab-detail")
                            )
                        )

                        print("Elemetn #product-description-usage .tab-detail ditemukan. Mengambil ingredients...")
                        el_tab =driver.find_element(By.CSS_SELECTOR, "#product-description-usage .tab-detail")
                        ingredients = el_tab.find_element(By.TAG_NAME, "p").text

                        produk["Ingredients"] = ingredients
                        detail_list.append(produk)
                        print("Berhasil scrap detail:", produk["nama"])

                    continue
            else:
                print("Tidak ada deskripsi produk")
                continue
        except Exception as e:
            error += 1
            print("Gagal scrap detail:", e)

            if error >= max_error:
                print("Terlalu banyak error, keluar")
                break

    return detail_list

def close_ins_popup(driver):
    try:
        popup = driver.find_element(By.CLASS_NAME, "ins-preview-wrapper")
        close_btn = popup.find_element(By.CLASS_NAME, "ins-element-close-button")
        close_btn.click()
        print("Pop-up ins-preview-wrapper berhasil ditutup.")
        time.sleep(1)  # beri jeda agar pop-up benar-benar hilang
    except Exception:
        pass  # Pop-up tidak muncul, lanjutkan saja

def export_to_excel(products):
    workbook = xlsxwriter.Workbook('produk_sociolla.xlsx')
    worksheet = workbook.add_worksheet('Produk')

    # Header
    headers = ['nama', 'brand', 'price', 'rating', 'link']
    for col, header in enumerate(headers):
        worksheet.write(0, col, header)

    # Data
    for row, produk in enumerate(products, start=1):
        worksheet.write(row, 0, produk['nama'])
        worksheet.write(row, 1, produk['brand'])
        worksheet.write(row, 2, produk['price'])
        worksheet.write(row, 3, produk['rating'])
        worksheet.write(row, 4, produk['link'])

    workbook.close()
    print(f"Data produk berhasil disimpan ke produk_sociolla.xlsx ({len(products)} produk)")

def export_details_to_excel(details):
    workbook = xlsxwriter.Workbook('detail_produk_sociolla.xlsx')
    worksheet = workbook.add_worksheet('Detail Produk')

    # Header
    headers = ['nama', 'brand', 'price', 'rating', 'link', 'ingredients']
    for col, header in enumerate(headers):
        worksheet.write(0, col, header)

    # Data
    for row, produk in enumerate(details, start=1):
        worksheet.write(row, 0, produk['nama'])
        worksheet.write(row, 1, produk['brand'])
        worksheet.write(row, 2, produk['price'])
        worksheet.write(row, 3, produk['rating'])
        worksheet.write(row, 4, produk['link'])
        worksheet.write(row, 5, produk['Ingredients'])

    workbook.close()
    print(f"Data detail produk berhasil disimpan ke detail_produk_sociolla.xlsx ({len(details)} produk)")

def setup():
    driver = webdriver.Chrome(options=opts)
    print("membuka browser ke ", Config.BASE_URL)
    driver.get(Config.BASE_URL)

    return driver

def teardown(driver):
    driver.quit()

driver = setup()
file_path_raw = "produk_sociolla.xlsx"
sudah_ada_scrap_raw = False

# Cek apakah file produk_sociolla.xlsx ada
try:
    pd.read_excel(file_path_raw)
    print("File produk_sociolla.xlsx ada. Lanjut scrapping detail langsung")
    sudah_ada_scrap_raw = True
except FileNotFoundError:
    pass

if sudah_ada_scrap_raw:
    # Membaca file Excel ke dalam DataFrame pandas
    try:
        df = pd.read_excel(file_path_raw)

        print("File Excel berhasil dibaca!")
    except FileNotFoundError:
        print(f"Error: File '{file_path_raw}' tidak ditemukan. Pastikan nama file dan path sudah benar dan file sudah diunggah.")
    except Exception as e:
        print(f"Terjadi kesalahan saat membaca atau mengolah file Excel: {e}")

    print("Convert ke dictionary...")
    df_dict = df.copy().to_dict('records')
    
    # Scrap detail setiap products
    detail_list = scrap_detail_produk(driver, df_dict)
    print(f"Terkumpul detail {len(detail_list)} produk.")
    print(detail_list)

    # Print ke excel menggunakan library xlsxwriter
    export_details_to_excel(detail_list)
else:
    # Cek apakah ada banner iklan
    ada_banner_iklan = check_banner_iklan(driver)

    if ada_banner_iklan:
        time.sleep(3)
        driver.find_element(By.CSS_SELECTOR, "#btn-close").click()

    # Ambil daftar category
    # categories = ambil_category(driver)
    # pprint.pprint(categories, indent=4)

    # Scrap products utama
    produk_list = scrap_produk_utama(driver, jumlah_target=350)
    print(f"Terkumpul {len(produk_list)} produk utama.")

    # Print ke excel menggunakan library xlsxwriter
    export_to_excel(produk_list)

    # Scrap detail setiap products
    detail_list = scrap_detail_produk(driver, produk_list)
    print(detail_list)

teardown(driver)