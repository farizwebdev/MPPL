"use client";

import { useEffect, useRef, useState } from "react";
import { formatRupiah } from "@/lib/utils";
import { ReceiptIcon, MoneyIcon, WeightIcon, TagIcon } from "./AdminIcons";

interface Service {
  id: string;
  name: string;
  pricePerKg: number;
  estimatedTime: string;
}

interface StatsProps {
  totalTransactions: number;
  todayRevenue: number;
  todayWeight: number;
  services: Service[];
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  index,
  visible,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  color: "blue" | "green" | "purple";
  index: number;
  visible: boolean;
}) {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white",
    green: "bg-green-50 text-green-600 group-hover:bg-green-600 group-hover:text-white",
    purple: "bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white",
  };

  return (
    <div
      className={`group relative rounded-2xl border border-gray-100 bg-white p-6 shadow-xs transition-all duration-500 hover:-translate-y-1 hover:border-gray-200 hover:shadow-md ${
        visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
      style={{ transitionDelay: `${index * 120}ms` }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="mt-1.5 text-2xl font-bold tracking-tight text-gray-900">
            {value}
          </p>
        </div>
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300 ${colorClasses[color]}`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-4 h-px w-10 rounded-full bg-gray-100 transition-all duration-300 group-hover:w-full group-hover:bg-blue-200" />
    </div>
  );
}

function ServiceCard({
  svc,
  index,
  visible,
}: {
  svc: Service;
  index: number;
  visible: boolean;
}) {
  return (
    <div
      className={`group rounded-2xl border border-gray-100 bg-white p-5 shadow-xs transition-all duration-500 hover:-translate-y-1 hover:border-gray-200 hover:shadow-md ${
        visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
      style={{ transitionDelay: `${index * 120}ms` }}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition-all duration-300 group-hover:bg-blue-600 group-hover:text-white">
        <TagIcon className="h-4 w-4" />
      </div>
      <h3 className="mt-3 font-semibold text-gray-900">{svc.name}</h3>
      <p className="mt-1 text-sm font-medium text-blue-600">
        {formatRupiah(svc.pricePerKg)}
        <span className="text-xs font-normal text-gray-400"> / kg</span>
      </p>
      <p className="mt-1 text-xs text-gray-400">
        Estimasi: {svc.estimatedTime}
      </p>
    </div>
  );
}

export default function DashboardStats({
  totalTransactions,
  todayRevenue,
  todayWeight,
  services,
}: StatsProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const stats = [
    {
      icon: ReceiptIcon,
      label: "Total Transaksi",
      value: String(totalTransactions),
      color: "blue" as const,
    },
    {
      icon: MoneyIcon,
      label: "Pendapatan Hari Ini",
      value: formatRupiah(todayRevenue),
      color: "green" as const,
    },
    {
      icon: WeightIcon,
      label: "Berat Hari Ini",
      value: `${todayWeight} kg`,
      color: "purple" as const,
    },
  ];

  return (
    <div ref={sectionRef}>
      {/* Page Header */}
      <div
        className={`mb-8 transition-all duration-500 ${
          visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
        }`}
      >
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Ringkasan aktivitas laundry hari ini
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, i) => (
          <StatCard key={stat.label} {...stat} index={i} visible={visible} />
        ))}
      </div>

      {/* Services Section */}
      {services.length > 0 && (
        <div className="mt-10">
          <div
            className={`mb-5 transition-all duration-500 delay-150 ${
              visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            }`}
            style={{ transitionDelay: "350ms" }}
          >
            <h2 className="text-lg font-semibold text-gray-900">
              Daftar Layanan
            </h2>
            <p className="mt-0.5 text-sm text-gray-500">
              Layanan laundry yang tersedia
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((svc, i) => (
              <ServiceCard
                key={svc.id}
                svc={svc}
                index={i}
                visible={visible}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
