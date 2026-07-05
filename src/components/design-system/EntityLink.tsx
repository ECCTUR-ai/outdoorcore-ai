import React from 'react';
import { useApp } from '@/context/AppContext';
import { EntityType } from '@/types/core';

interface EntityLinkProps {
  type: EntityType;
  id: string;
  label: string;
}

export function EntityLink({ type, id, label }: EntityLinkProps) {
  const { setCurrentRoute } = useApp();

  const getRouteDetails = () => {
    switch (type) {
      case 'company':
        return { route: 'firmalar-markalar', param: `companyId=${id}` };
      case 'space':
        return { route: 'reklam-alanlari', param: `spaceId=${id}` };
      case 'offer':
        return { route: 'teklifler', param: `offerId=${id}` };
      case 'contract':
        return { route: 'sozlesmeler', param: `contractId=${id}` };
      case 'reservation':
        return { route: 'rezervasyonlar', param: `reservationId=${id}` };
      case 'campaign':
        return { route: 'kampanyalar', param: `campaignId=${id}` };
      case 'invoice':
      case 'payment':
        return { route: 'finans', param: `invoiceId=${id}` };
      case 'task':
      case 'notification':
        return { route: 'bildirimler', param: `taskId=${id}` };
      default:
        return { route: 'dashboard', param: '' };
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const { route, param } = getRouteDetails();
    
    // Update the browser URL with query param
    const newUrl = `${window.location.pathname}?${param}`;
    window.history.pushState({ path: newUrl }, '', newUrl);
    
    // Trigger route change in the app context
    setCurrentRoute(route as any);
  };

  const getBadgeColors = () => {
    switch (type) {
      case 'company':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20';
      case 'space':
        return 'bg-sky-500/10 text-sky-400 border-sky-500/20 hover:bg-sky-500/20';
      case 'offer':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20';
      case 'contract':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20 hover:bg-purple-500/20';
      case 'reservation':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20';
      case 'campaign':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 hover:bg-indigo-500/20';
      case 'invoice':
      case 'payment':
        return 'bg-teal-500/10 text-teal-400 border-teal-500/20 hover:bg-teal-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20 hover:bg-slate-500/20';
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`px-2 py-0.5 rounded-lg border text-[9.5px] font-black uppercase tracking-wider transition-all duration-150 cursor-pointer shadow-sm ${getBadgeColors()}`}
    >
      {label}
    </button>
  );
}
