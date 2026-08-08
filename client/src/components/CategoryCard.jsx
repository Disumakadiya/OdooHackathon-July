import React from 'react';

export default function CategoryCard({ category, onView, onEdit, onDelete }) {
  return (
    <div className="bg-surface-container-lowest rounded-[16px] p-lg ambient-shadow border border-outline-variant/30 hover:border-primary/20 transition-all group flex flex-col h-full">
      <div className="flex justify-between items-start mb-md">
        <div className={`p-3 rounded-xl ${category.iconBg}`}>
          <span className="material-symbols-outlined text-[28px]">{category.icon}</span>
        </div>
        <div className="relative">
          <button className="p-1.5 text-outline hover:text-primary transition-colors" onClick={() => { /* menu could be implemented */ }}>
            <span className="material-symbols-outlined">more_vert</span>
          </button>
          <div className="hidden group-hover:block absolute right-0 mt-8 w-40 bg-surface border border-outline-variant rounded shadow-md">
            <button onClick={() => onView(category)} className="w-full text-left px-3 py-2 hover:bg-surface-container-low">View</button>
            <button onClick={() => onEdit(category)} className="w-full text-left px-3 py-2 hover:bg-surface-container-low">Edit</button>
            <button onClick={() => onDelete(category)} className="w-full text-left px-3 py-2 text-error hover:bg-surface-container-low">Delete</button>
          </div>
        </div>
      </div>

      <h3 className="font-headline-md text-headline-md text-on-surface mb-xs">{category.name}</h3>
      <p className="font-body-md text-body-md text-on-surface-variant mb-lg flex-1">{category.desc}</p>

      <div className="space-y-sm">
        <div className="flex justify-between items-center py-2 border-b border-outline-variant/20">
          <span className="font-label-md text-on-surface-variant">Total Assets</span>
          <span className="font-label-md font-bold text-primary">{category.total}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-outline-variant/20">
          <span className="font-label-md text-on-surface-variant">Last Audit</span>
          <span className={`font-label-md ${category.auditColor}`}>{category.lastAudit}</span>
        </div>
        <div className="pt-md flex items-center justify-between">
          {category.showAvatars && (
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full border-2 border-surface bg-surface-container-highest overflow-hidden">
                <img className="w-full h-full object-cover" src={category.avatar1} alt="" />
              </div>
              <div className="w-8 h-8 rounded-full border-2 border-surface bg-surface-container-highest overflow-hidden">
                <img className="w-full h-full object-cover" src={category.avatar2} alt="" />
              </div>
              <div className="w-8 h-8 rounded-full border-2 border-surface bg-surface-container-highest flex items-center justify-center text-[10px] font-bold text-on-surface-variant">+{category.extra}</div>
            </div>
          )}
          {category.badge && (
            <span className={`inline-flex items-center gap-xs px-2 py-1 rounded ${category.badge.color} text-label-sm font-semibold uppercase tracking-wider`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
              {category.badge.label}
            </span>
          )}
          <a onClick={() => onView(category)} className="text-primary font-label-md flex items-center gap-xs cursor-pointer">
            View Details <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </a>
        </div>
      </div>
    </div>
  );
}
