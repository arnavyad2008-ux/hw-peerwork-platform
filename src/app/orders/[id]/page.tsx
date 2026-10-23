'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useMarketplace } from '@/lib/store';
import { OrderWorkspace } from '@/components/orders/OrderWorkspace';
import { ArrowLeft, PackageCheck } from 'lucide-react';

export default function OrderPage() {
  const params = useParams();
  const { getOrderById } = useMarketplace();

  const orderId = params?.id as string;
  const order = getOrderById(orderId);

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
          <PackageCheck size={28} />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Order Workspace Not Found</h2>
        <p className="text-sm text-slate-500">The project order could not be located.</p>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-campus-600 text-white"
        >
          <ArrowLeft size={14} /> Go to Dashboard
        </Link>
      </div>
    );
  }

  return <OrderWorkspace order={order} />;
}
