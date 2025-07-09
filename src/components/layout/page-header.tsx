import { ArrowLeft, Search, Bell } from 'lucide-react'

interface PageHeaderProps {
  title: string
  onBack?: () => void
  showBackButton?: boolean
  showActions?: boolean
  showNotification?: boolean
  userInitials?: string
  className?: string
}

export const PageHeader = ({
  title,
  onBack,
  showBackButton = true,
  showActions = true,
  showNotification = true,
  userInitials = 'DY',
  className = ''
}: PageHeaderProps) => {
  return (
    <div className={`bg-white pt-5 px-8 border-b-0 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {showBackButton && onBack && (
            <button
              onClick={onBack}
              className="w-8 h-8 border border-[#e4e7ec] rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-[18px] h-[18px] text-gray-600" />
            </button>
          )}
          <h1 
            className="text-2xl font-medium text-[#141c25] tracking-[-0.01em] leading-8" 
            style={{ fontFamily: '"Inter-Medium", sans-serif' }}
          >
            {title}
          </h1>
        </div>
        
        {showActions && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                <Search className="w-[22px] h-[22px] text-gray-600" />
              </button>
              <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors relative">
                <Bell className="w-[22px] h-[22px] text-gray-600" />
                {showNotification && (
                  <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#0166ff] rounded-full"></div>
                )}
              </button>
            </div>
            <div className="w-10 h-10 bg-[#e5f2ff] rounded-full flex items-center justify-center">
              <span 
                className="text-[#003166] text-lg font-medium leading-7" 
                style={{ fontFamily: '"Inter-Medium", sans-serif' }}
              >
                {userInitials}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 