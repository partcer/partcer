import { TrendingDown, TrendingUp } from "lucide-react";

function StatCard({ title, value, change, icon, trend = "up", currency, suffix }) {
    const TrendIcon = trend === "up" ? TrendingUp : TrendingDown;

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
                    <div className="flex items-baseline">
                        {currency && <span className="text-lg font-semibold text-gray-700 mr-1">{currency}</span>}
                        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
                        {suffix && <span className="text-lg font-semibold text-gray-700 ml-1">{suffix}</span>}
                    </div>
                </div>
                <div className="p-3 rounded-lg bg-primary/10 text-primary">
                    {icon}
                </div>
            </div>

            {change && (
                <div className={`flex items-center mt-4 text-sm ${trend === "up" ? "text-green-600" : "text-red-600"}`}>
                    <TrendIcon size={16} className="mr-1" />
                    <span>{change}</span>
                </div>
            )}
        </div>
    );
}

export default StatCard;