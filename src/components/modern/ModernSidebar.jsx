import React, { useState } from 'react'
import { 
  Folder, 
  Plus, 
  ChevronRight, 
  MoreHorizontal,
  Users,
  Calendar,
  BarChart3,
  Settings,
  Moon,
  Sun
} from 'lucide-react'
import useDarkMode from '../../hooks/useDarkMode'

const ModernSidebar = ({ 
  boards, 
  activeBoard, 
  onBoardSelect, 
  onCreateBoard,
  sidebarOpen,
  setSidebarOpen 
}) => {
  const [colorTheme, setTheme] = useDarkMode()
  const [darkMode, setDarkMode] = useState(colorTheme === 'light')

  const toggleDarkMode = () => {
    setTheme(darkMode ? 'light' : 'dark')
    setDarkMode(!darkMode)
  }

  const sidebarClasses = `
    fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transform transition-transform duration-300 ease-in-out
    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
  `

  return (
    <>
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={sidebarClasses}>
        <div className="flex flex-col h-full">
          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {/* Boards Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Boards ({boards?.length || 0})
                </h3>
                <button
                  onClick={onCreateBoard}
                  className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"
                >
                  <Plus className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                </button>
              </div>

              <div className="space-y-1">
                {boards?.map((board, index) => (
                  <button
                    key={board.id || index}
                    onClick={() => onBoardSelect(board, index)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors group ${
                      board.isActive || activeBoard?.id === board.id
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    <Folder className="h-4 w-4 flex-shrink-0" />
                    <span className="flex-1 truncate text-sm font-medium">
                      {board.name}
                    </span>
                    <MoreHorizontal className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}

                {(!boards || boards.length === 0) && (
                  <div className="text-center py-8">
                    <Folder className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                      No boards yet
                    </p>
                    <button
                      onClick={onCreateBoard}
                      className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                    >
                      Create your first board
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-1">
              <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                Quick Actions
              </h3>
              
              <button className="w-full flex items-center gap-3 px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                <Users className="h-4 w-4" />
                <span className="text-sm font-medium">Team</span>
              </button>
              
              <button className="w-full flex items-center gap-3 px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                <Calendar className="h-4 w-4" />
                <span className="text-sm font-medium">Calendar</span>
              </button>
              
              <button className="w-full flex items-center gap-3 px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                <BarChart3 className="h-4 w-4" />
                <span className="text-sm font-medium">Reports</span>
              </button>
            </div>
          </nav>

          {/* Bottom Section */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-700">
            {/* Theme Toggle */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Dark Mode
              </span>
              <button
                onClick={toggleDarkMode}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  darkMode ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    darkMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
                {darkMode ? (
                  <Moon className="absolute left-1 h-3 w-3 text-blue-600" />
                ) : (
                  <Sun className="absolute right-1 h-3 w-3 text-slate-400" />
                )}
              </button>
            </div>

            {/* Settings */}
            <button className="w-full flex items-center gap-3 px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
              <Settings className="h-4 w-4" />
              <span className="text-sm font-medium">Settings</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}

export default ModernSidebar