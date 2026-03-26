import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { motion } from 'framer-motion';
import { ShieldCheck, Zap, Activity, BarChart3, TrendingUp, Info } from 'lucide-react';

const Evaluation = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvaluation = async () => {
      try {
        setLoading(true);
        // Assuming apiService.evaluate() is added to api.js
        const data = await apiService.getEvaluation();
        if (data && data.results) {
          setResults(data.results);
        }
      } catch (err) {
        console.error("Evaluation error:", err);
        setError("Gagal memuat data evaluasi.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvaluation();
  }, []);

  // Calculate Average
  const average = results.length > 0 ? {
    user: 'Rata-rata',
    precision: results.reduce((a, b) => a + b.precision, 0) / results.length,
    recall: results.reduce((a, b) => a + b.recall, 0) / results.length,
    f1: results.reduce((a, b) => a + b.f1, 0) / results.length,
    rmse: results.reduce((a, b) => a + b.rmse, 0) / results.length,
  } : null;

  if (loading) return (
    <div className="min-h-screen bg-neutral-50 pt-24 flex flex-col items-center justify-center space-y-4">
      <div className="w-12 h-12 border-4 border-neutral-200 border-t-primary rounded-full animate-spin"></div>
      <p className="text-xs font-black uppercase tracking-widest text-neutral-400">Computing Metrics...</p>
    </div>
  );

  return (
    <div className="bg-[#f8f9fa] min-h-screen pt-24 pb-40">
      <div className="max-w-7xl mx-auto px-6 space-y-12">
        
        {/* Header Portfolio Style */}
        <header className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-neutral-100 rounded-lg shadow-sm">
                <ShieldCheck size={14} className="text-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Quality Assurance Protocol</span>
            </div>
            <h1 className="text-5xl font-black text-neutral-900 tracking-tighter uppercase leading-none">
                System <br/> <span className="text-neutral-300 italic">Evaluation</span>
            </h1>
            <p className="text-neutral-500 font-medium max-w-xl text-sm leading-relaxed">
                Analisis akurasi sistem rekomendasi menggunakan 5 skenario user dengan metrik Precision, Recall, F1-Score, dan RMSE.
            </p>
        </header>

        {/* Dashboard Grid */}
        <div className="grid lg:grid-cols-12 gap-10">
            
            {/* Table Detail */}
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="lg:col-span-12 bg-white border border-neutral-100 rounded-[2.5rem] p-10 shadow-sm overflow-hidden"
            >
                <div className="flex items-center gap-3 mb-10">
                    <Activity size={20} className="text-primary" />
                    <h2 className="text-xl font-black uppercase tracking-tight">Metrics Performance Table</h2>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-neutral-100">
                                <th className="pb-6 text-[11px] font-black uppercase tracking-widest text-neutral-400">Scenario</th>
                                <th className="pb-6 text-[11px] font-black uppercase tracking-widest text-neutral-400">Precision@10</th>
                                <th className="pb-6 text-[11px] font-black uppercase tracking-widest text-neutral-400">Recall@10</th>
                                <th className="pb-6 text-[11px] font-black uppercase tracking-widest text-neutral-400">F1-Score</th>
                                <th className="pb-6 text-[11px] font-black uppercase tracking-widest text-neutral-400 text-right">RMSE (Error)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-50">
                            {results.map((res) => (
                                <tr key={res.user} className="group hover:bg-neutral-50/50 transition-colors">
                                    <td className="py-6 font-black text-neutral-900 uppercase tracking-tighter">{res.user}</td>
                                    <td className="py-6 font-bold text-neutral-600">{(res.precision * 100).toFixed(1)}%</td>
                                    <td className="py-6 font-bold text-neutral-600">{(res.recall * 100).toFixed(1)}%</td>
                                    <td className="py-6 font-bold text-neutral-600">{(res.f1 * 100).toFixed(1)}%</td>
                                    <td className="py-6 font-black text-neutral-900 text-right">
                                        <span className={res.rmse < 1 ? "text-green-500" : "text-primary"}>{res.rmse.toFixed(3)}</span>
                                    </td>
                                </tr>
                            ))}
                            {average && (
                                <tr className="bg-neutral-900 text-white">
                                    <td className="py-6 px-4 rounded-l-2xl font-black uppercase italic tracking-tighter">{average.user}</td>
                                    <td className="py-6 font-black">{(average.precision * 100).toFixed(1)}%</td>
                                    <td className="py-6 font-black">{(average.recall * 100).toFixed(1)}%</td>
                                    <td className="py-6 font-black">{(average.f1 * 100).toFixed(1)}%</td>
                                    <td className="py-6 px-4 rounded-r-2xl font-black text-right text-primary">{average.rmse.toFixed(3)}</td>
                                </tr>
                            ) }
                        </tbody>
                    </table>
                </div>
            </motion.div>

            {/* Chart Section - PR/REC/F1 */}
            <motion.div 
               initial={{ opacity: 0, x: -30 }}
               animate={{ opacity: 1, x: 0 }}
               className="lg:col-span-8 bg-white border border-neutral-100 rounded-[2.5rem] p-10 shadow-sm"
            >
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-3">
                        <BarChart3 size={20} className="text-primary" />
                        <h2 className="text-xl font-black uppercase tracking-tight">Acuracy Distribution</h2>
                    </div>
                </div>
                
                <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={results} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                            <XAxis dataKey="user" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900 }} />
                            <Tooltip 
                                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', background: '#171717', color: 'white' }}
                                itemStyle={{ fontWeight: 800, fontSize: '10px', textTransform: 'uppercase' }}
                            />
                            <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase' }} />
                            <Bar dataKey="precision" name="Precision" fill="#e63946" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="recall" name="Recall" fill="#22c55e" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="f1" name="F1-Score" fill="#1d3557" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>

            {/* RMSE Trend Chart */}
            <motion.div 
               initial={{ opacity: 0, x: 30 }}
               animate={{ opacity: 1, x: 0 }}
               className="lg:col-span-4 bg-neutral-900 text-white rounded-[2.5rem] p-10 shadow-xl overflow-hidden relative"
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] -mr-16 -mt-16"></div>
                
                <div className="flex items-center gap-3 mb-10 relative z-10">
                    <TrendingUp size={20} className="text-primary" />
                    <h2 className="text-xl font-black uppercase tracking-tight">RMSE Deviation</h2>
                </div>

                <div className="h-[300px] w-full relative z-10">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={results}>
                            <defs>
                                <linearGradient id="colorRmse" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#e63946" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="#e63946" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="user" hide />
                            <Tooltip 
                                contentStyle={{ borderRadius: '16px', border: 'none', background: '#ffffff', color: 'black' }}
                                itemStyle={{ fontWeight: 800, fontSize: '10px', color: '#e63946' }}
                                labelStyle={{ color: '#666', fontSize: '9px', fontWeight: 800 }}
                            />
                            <Area type="monotone" dataKey="rmse" stroke="#e63946" strokeWidth={4} fillOpacity={1} fill="url(#colorRmse)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div className="mt-8 space-y-4 relative z-10">
                    <div className="flex items-start gap-3">
                        <Info size={16} className="text-primary shrink-0" />
                        <p className="text-[10px] font-medium text-neutral-400 leading-relaxed uppercase tracking-wider">
                            RMSE Mengukur penyimpangan rating prediksi (dikonversi dari similarity) terhadap rating aktual. Semakin rendah nilai RMSE, semakin akurat sistem memprediksi kepuasan user.
                        </p>
                    </div>
                </div>
            </motion.div>

        </div>
      </div>
    </div>
  );
};

export default Evaluation;
