import React from 'react';
import { FaPlus } from 'react-icons/fa';
import { cn } from '~/utils';

const SidebarItem = ({
  id,
  icon,
  active,
  expanded,
  isSearch,
  level,
  onExpand,
  label,
  onClick,
}) => {
  const handleExpand = (e) => {
    e.stopPropagation();
    onExpand();
  };

  return (
    <div
      onClick={onClick}
      role="button"
      style={{ paddingLeft: level ? `${level * 12 + 12}px` : '12px' }}
      className={cn(
        'group min-h-[27px] text-sm py-1 pr-3 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-medium',
        active && 'bg-primary/5 text-primary'
      )}
    >
      {!!id && (
        <div
          role="button"
          className="h-full rounded-full hover:bg-neutral-300 dark:bg-neutral-600 mr-1"
          onClick={() => {}}
        >
          {/* Expand icon */}
          {/* className: h-4 w-4 shrink-0 text-muted-foreground/50 */}
        </div>
      )}
      {documentIcon ? (
        <div className="shrink-0 mr-2 text-[18px]">{documentIcon}</div>
      ) : (
        // Icon
        <></>
      )}
      <FaPlus className="shrink-0 h-[18px] mr-2 text-muted-foreground" />
      <span className="truncate">{label}</span>
      {isSearch && (
        <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      )}
    </div>
  );
};

const SkeletonSidebarItem = ({ level }) => {
  return (
    <div
      style={{
        paddingLeft: level ? `${level * 12 + 25}px` : '12px',
      }}
      className="flex gap-x-2 py-[3px]"
    >
      {/* Skeleton here */}
    </div>
  );
};

export default SidebarItem;