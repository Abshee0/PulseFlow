import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase, getUserBoards, shareBoard } from '../lib/supabase'
import ModernHeader from './modern/ModernHeader'
import ModernSidebar from './modern/ModernSidebar'
import ModernBoard from './modern/ModernBoard'
import ShareBoardModal from './modern/ShareBoardModal'
import AddEditBoardModal from '../modals/AddEditBoardModal'
import AddEditTaskModal from '../modals/AddEditTaskModal'

const Dashboard = () => {
  const { user } = useAuth()
  const [boards, setBoards] = useState([])
  const [activeBoard, setActiveBoard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  // Modal states
  const [showShareModal, setShowShareModal] = useState(false)
  const [showBoardModal, setShowBoardModal] = useState(false)
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [taskModalColumn, setTaskModalColumn] = useState(0)

  useEffect(() => {
    loadBoards()
  }, [user])

  const loadBoards = async () => {
    try {
      setLoading(true)
      const { data, error } = await getUserBoards()
      
      if (error) {
        console.error('Error loading boards:', error)
        return
      }

      // Transform data to match existing structure
      const transformedBoards = data?.map((board, index) => ({
        ...board,
        isActive: index === 0 && !activeBoard,
        columns: board.columns || []
      })) || []

      setBoards(transformedBoards)
      
      if (transformedBoards.length > 0 && !activeBoard) {
        setActiveBoard(transformedBoards[0])
      }
    } catch (error) {
      console.error('Error loading boards:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBoardSelect = (board, index) => {
    const updatedBoards = boards.map((b, i) => ({
      ...b,
      isActive: i === index
    }))
    setBoards(updatedBoards)
    setActiveBoard(board)
    setSidebarOpen(false) // Close sidebar on mobile after selection
  }

  const handleCreateBoard = () => {
    setShowBoardModal(true)
  }

  const handleCreateTask = (columnIndex = 0) => {
    setTaskModalColumn(columnIndex)
    setShowTaskModal(true)
  }

  const handleShareBoard = async (boardId, email) => {
    try {
      await shareBoard(boardId, email)
      // Optionally refresh boards or show success message
    } catch (error) {
      throw error
    }
  }

  const handleTaskUpdate = (task) => {
    // Handle task updates
    console.log('Update task:', task)
  }

  const handleTaskDelete = (task) => {
    // Handle task deletion
    console.log('Delete task:', task)
  }

  const handleColumnCreate = () => {
    // Handle column creation
    console.log('Create column')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Loading your workspace...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <ModernHeader
        currentBoard={activeBoard}
        onCreateTask={() => handleCreateTask()}
        onCreateBoard={handleCreateBoard}
        onShareBoard={() => setShowShareModal(true)}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <ModernSidebar
          boards={boards}
          activeBoard={activeBoard}
          onBoardSelect={handleBoardSelect}
          onCreateBoard={handleCreateBoard}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        
        <ModernBoard
          board={activeBoard}
          onTaskCreate={handleCreateTask}
          onTaskUpdate={handleTaskUpdate}
          onTaskDelete={handleTaskDelete}
          onColumnCreate={handleColumnCreate}
        />
      </div>

      {/* Modals */}
      {showShareModal && activeBoard && (
        <ShareBoardModal
          board={activeBoard}
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          onShare={handleShareBoard}
        />
      )}

      {showBoardModal && (
        <AddEditBoardModal
          type="add"
          setIsBoardModalOpen={setShowBoardModal}
          onBoardCreated={loadBoards}
        />
      )}

      {showTaskModal && (
        <AddEditTaskModal
          type="add"
          setIsAddTaskModalOpen={setShowTaskModal}
          columnIndex={taskModalColumn}
          onTaskCreated={loadBoards}
        />
      )}
    </div>
  )
}

export default Dashboard