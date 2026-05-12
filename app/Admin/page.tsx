'use client';

import { useState, useEffect, useCallback } from 'react';
import { Target, CheckCircle, XCircle, AlertTriangle, Download, Settings } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Link from 'next/link';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
    ReferenceLine, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Metrics {
    accuracy: number; accuracyΔ: number;
    correct: number; correctΔ: number;
    wrong: number; wrongΔ: number;
    alerts: number; alertCategories: string[];
    trend: { month: string; accuracy: number; target: number }[];
    alignment: { category: string; pct: number; color: 'green' | 'amber' }[];
    distribution: { correct: number; wrong: number; unclassified: number };
}

interface Rec {
    id: string; type: 'warning' | 'info' | 'danger';
    title: string; desc: string; action: string; actionType: string;
}

// ─── Mock data (thay bằng fetch thật) ────────────────────────────────────────

const TREND: Record<string, Metrics['trend']> = {
    '1m': [{ month: 'T6', accuracy: 94.2, target: 90 }],
    '3m': [{ month: 'T4', accuracy: 91.5, target: 90 }, { month: 'T5', accuracy: 93.2, target: 90 }, { month: 'T6', accuracy: 94.2, target: 90 }],
    '6m': ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'].map((m, i) => ({ month: m, accuracy: [88.5, 89.8, 90.2, 91.5, 93.2, 94.2][i], target: 90 })),
    '12m': ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'].map((m, i) => ({ month: m, accuracy: [85, 86.5, 87.8, 88.5, 89.8, 90.2, 91.5, 92, 92.8, 93.2, 93.9, 94.2][i], target: 90 })),
};

function getMockMetrics(period: string): Metrics {
    return {
        accuracy: 94.2, accuracyΔ: 1.2,
        correct: 85, correctΔ: 1.2,
        wrong: 5, wrongΔ: -0.4,
        alerts: 2, alertCategories: ['Giải trí', 'Mua sắm'],
        trend: TREND[period] ?? TREND['6m'],
        alignment: [
            { category: 'Ăn uống', pct: 92, color: 'green' },
            { category: 'Di chuyển', pct: 88, color: 'green' },
            { category: 'Nhà cửa', pct: 85, color: 'green' },
            { category: 'Mua sắm', pct: 82, color: 'green' },
            { category: 'Giải trí', pct: 78, color: 'amber' },
            { category: 'Đầu tư', pct: 86, color: 'green' },
        ],
        distribution: { correct: 85, wrong: 5, unclassified: 10 },
    };
}

const RECS: Rec[] = [
    { id: '1', type: 'warning', title: "Danh mục 'Giải trí' có độ tự tin thấp", desc: "Độ chính xác hiện tại là 78%. Đề xuất: Bổ sung thêm dữ liệu mẫu (keywords) từ giao dịch người dùng.", action: 'Xem xét từ khóa', actionType: 'review_keywords' },
    { id: '2', type: 'info', title: "Nhiều nhãn 'Chưa phân loại' mới", desc: "Có 1,200 giao dịch tuần qua không thể tự động phân loại. Cần xem xét gom nhóm thành danh mục mới.", action: 'Phân tích gom cụm', actionType: 'cluster_analysis' },
    { id: '3', type: 'danger', title: 'Dấu hiệu Model Drift nhẹ', desc: 'Tỷ lệ dự đoán sai tăng 0.5% trong 7 ngày qua. Đề xuất chuẩn bị kế hoạch huấn luyện lại (retrain) trong tháng tới.', action: 'Lên lịch Retrain', actionType: 'schedule_retrain' },
];

const REC_S = {
    warning: { card: 'bg-amber-50 border-amber-200', title: 'text-amber-800', desc: 'text-amber-700', btn: 'border-amber-400 text-amber-800 hover:bg-amber-100' },
    info: { card: 'bg-blue-50 border-blue-200', title: 'text-blue-800', desc: 'text-blue-700', btn: 'border-blue-300  text-blue-800  hover:bg-blue-100' },
    danger: { card: 'bg-red-50 border-red-200', title: 'text-red-800', desc: 'text-red-700', btn: 'border-red-300   text-red-800   hover:bg-red-100' },
};

const DONUT_COLORS = ['#10b981', '#ef4444', '#f59e0b'];
const PERIODS = [{ value: '1m', label: '1 Tháng qua' }, { value: '3m', label: '3 Tháng qua' }, { value: '6m', label: '6 Tháng qua' }, { value: '12m', label: '12 Tháng qua' }];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AiMonitorPage() {
    const [period, setPeriod] = useState('6m');
    const [metrics, setMetrics] = useState<Metrics | null>(null);
    const [done, setDone] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState<string | null>(null);

    const load = useCallback(async () => {
        // TODO: const data = await fetch(`/api/ai-monitor/metrics?period=${period}`).then(r => r.json());
        setMetrics(getMockMetrics(period));
    }, [period]);

    useEffect(() => { load(); }, [load]);

    const triggerAction = async (rec: Rec) => {
        if (done.has(rec.id)) return;
        setLoading(rec.id);
        // TODO: await fetch('/api/ai-monitor/action', { method: 'POST', body: JSON.stringify({ actionType: rec.actionType }) });
        await new Promise(r => setTimeout(r, 800));
        setDone(p => new Set(p).add(rec.id));
        setLoading(null);
    };

    if (!metrics) return <div className="flex items-center justify-center h-64"><div className="w-7 h-7 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" /></div>;

    const { trend, alignment, distribution } = metrics;
    const donutData = [
        { name: 'Đúng', value: distribution.correct },
        { name: 'Sai', value: distribution.wrong },
        { name: 'Chưa phân loại', value: distribution.unclassified },
    ];

    const Delta = ({ v }: { v: number }) =>
        v === 0 ? <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">0%</span>
            : v > 0 ? <span className="text-xs px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-600">+{v}%</span>
                : <span className="text-xs px-1.5 py-0.5 rounded bg-red-50 text-red-500">{v}%</span>;

return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* 1. Gọi Sidebar nằm bên trái */}
            <Sidebar />

            {/* Cột bên phải chứa Header và Nội dung chính */}
            <div className="flex-1 flex flex-col overflow-hidden">
                
                {/* 2. Gọi Header nằm trên cùng */}
                <Header />

                {/* 3. Vùng chứa nội dung cuộn được (Main content) */}
                <main className="flex-1 overflow-y-auto">
                    <div className="p-6 space-y-5 max-w-screen-2xl mx-auto">

                        {/* Header của Page */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                                <h1 className="text-xl font-semibold text-gray-900">Giám sát hiệu suất mô hình AI</h1>
                                <p className="text-sm text-gray-500 mt-0.5">Theo dõi, đánh giá độ chính xác và điều chỉnh chất lượng dự đoán</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <select value={period} onChange={e => setPeriod(e.target.value)} className="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-violet-300">
                                    {PERIODS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                                </select>
                                <button className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors">
                                    <Download className="w-4 h-4" />Xuất báo cáo
                                </button>
                            </div>
                        </div>

                        {/* KPI cards */}
                        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
                            {[
                                { icon: <Target className="w-5 h-5 text-violet-600" />, bg: 'bg-violet-50', label: 'Độ chính xác hiện tại', value: `${metrics.accuracy}%`, delta: metrics.accuracyΔ, sub: 'Vượt mục tiêu 90%' },
                                { icon: <CheckCircle className="w-5 h-5 text-emerald-600" />, bg: 'bg-emerald-50', label: 'Dự đoán đúng', value: `${metrics.correct}%`, delta: metrics.correctΔ, sub: 'Trong tổng số giao dịch' },
                                { icon: <XCircle className="w-5 h-5 text-red-500" />, bg: 'bg-red-50', label: 'Dự đoán sai', value: `${metrics.wrong}%`, delta: metrics.wrongΔ, sub: 'Cần cải thiện' },
                                { icon: <AlertTriangle className="w-5 h-5 text-amber-500" />, bg: 'bg-amber-50', label: 'Cảnh báo lệch dữ liệu', value: metrics.alerts, delta: 0, sub: `Danh mục '${metrics.alertCategories.join("', '")}'` },
                            ].map(({ icon, bg, label, value, delta, sub }) => (
                                <div key={label} className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-col gap-3 hover:border-gray-200 transition-colors">
                                    <div className="flex items-start justify-between">
                                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${bg}`}>{icon}</div>
                                        <Delta v={delta} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 mb-0.5">{label}</p>
                                        <p className="text-2xl font-semibold text-gray-900 tracking-tight">{value}</p>
                                    </div>
                                    <p className="text-xs text-gray-400">{sub}</p>
                                </div>
                            ))}
                        </div>

                        {/* Charts row */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            {/* Trend */}
                            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-5">
                                <p className="text-sm font-medium text-gray-800">Xu hướng Độ chính xác (Accuracy)</p>
                                <p className="text-xs text-gray-400 mb-4">So sánh hiệu suất thực tế so với mục tiêu</p>
                                <ResponsiveContainer width="100%" height={200}>
                                    <LineChart data={trend} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} />
                                        <YAxis domain={[80, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} />
                                        <Tooltip
                                            contentStyle={{ borderRadius: 12, border: '1px solid #f0f0f0', fontSize: 12 }}
                                            formatter={(v: any, k: any) => [`${v}%`, k === 'accuracy' ? 'Thực tế' : 'Mục tiêu']}
                                        />
                                        <ReferenceLine y={90} stroke="#d1d5db" strokeDasharray="5 5" />
                                        <Line type="monotone" dataKey="accuracy" stroke="#10b981" strokeWidth={2} dot={{ r: 4, fill: '#10b981', strokeWidth: 0 }} />
                                        <Line type="monotone" dataKey="target" stroke="transparent" dot={false} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Donut */}
                            <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col">
                                <p className="text-sm font-medium text-gray-800">Tỷ lệ Dự đoán</p>
                                <p className="text-xs text-gray-400 mb-4">Phân bố kết quả (True/False)</p>
                                <div className="flex flex-col items-center flex-1 justify-center">
                                    <div className="relative w-36 h-36">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie data={donutData} cx="50%" cy="50%" innerRadius={44} outerRadius={62} startAngle={90} endAngle={-270} dataKey="value" strokeWidth={0}>
                                                    {donutData.map((_, i) => <Cell key={i} fill={DONUT_COLORS[i]} />)}
                                                </Pie>
                                            </PieChart>
                                        </ResponsiveContainer>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <span className="text-xl font-semibold text-gray-900">{distribution.correct}%</span>
                                            <span className="text-xs text-gray-400">Độ chính xác</span>
                                        </div>
                                    </div>
                                    <div className="mt-4 space-y-2 w-full">
                                        {donutData.map((d, i) => (
                                            <div key={d.name} className="flex items-center justify-between text-xs">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full" style={{ background: DONUT_COLORS[i] }} />
                                                    <span className="text-gray-500">{d.name}</span>
                                                </div>
                                                <span className="font-medium text-gray-800">{d.value}%</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Alignment + Recommendations */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {/* Alignment */}
                            <div className="bg-white rounded-2xl border border-gray-100 p-5">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">Mức độ phù hợp với Dữ liệu (Alignment)</p>
                                        <p className="text-xs text-gray-400">Độ chính xác chia theo từng danh mục</p>
                                    </div>
                                    <button className="text-xs font-medium text-violet-600 hover:underline">Chi tiết</button>
                                </div>
                                <div className="space-y-3">
                                    {alignment.map(a => (
                                        <div key={a.category} className="flex items-center gap-3">
                                            <span className="text-xs text-gray-500 w-16 text-right shrink-0">{a.category}</span>
                                            <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                                                <div className={`h-full rounded-full ${a.color === 'green' ? 'bg-emerald-500' : 'bg-amber-400'}`} style={{ width: `${a.pct}%` }} />
                                            </div>
                                            <span className="text-xs font-medium text-gray-700 w-8 text-right">{a.pct}%</span>
                                        </div>
                                    ))}
                                    <div className="flex justify-between text-xs text-gray-400 pl-[76px] pr-8 pt-1">
                                        {['0', '25', '50', '75', '100'].map(n => <span key={n}>{n}</span>)}
                                    </div>
                                </div>
                            </div>

                            {/* Recommendations */}
                            <div className="bg-white rounded-2xl border border-gray-100 p-5">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">Mô hình AI: Đề xuất tinh chỉnh</p>
                                        <p className="text-xs text-gray-400">Các hành động cần thiết để cải thiện</p>
                                    </div>
                                    <Settings className="w-4 h-4 text-gray-400 cursor-pointer" />
                                </div>
                                <div className="space-y-3">
                                    {RECS.map(rec => {
                                        const s = REC_S[rec.type];
                                        return (
                                            <div key={rec.id} className={`rounded-xl border p-3.5 ${s.card}`}>
                                                <p className={`text-xs font-semibold mb-1 ${s.title}`}>{rec.title}</p>
                                                <p className={`text-xs mb-2.5 leading-relaxed ${s.desc}`}>{rec.desc}</p>
                                                <button
                                                    onClick={() => triggerAction(rec)}
                                                    disabled={done.has(rec.id) || loading === rec.id}
                                                    className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors disabled:opacity-50 ${s.btn}`}
                                                >
                                                    {loading === rec.id ? 'Đang xử lý...' : done.has(rec.id) ? '✓ Đã thực hiện' : rec.action}
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
}