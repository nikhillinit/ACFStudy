import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { 
  PlusCircle, 
  Edit3, 
  Trash2, 
  Save, 
  Search, 
  BookOpen, 
  Calendar,
  Tag
} from 'lucide-react'

export function NoteTaking({ lessonId, lessonTitle }) {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState({ title: '', content: '', tags: '' })
  const [editingNote, setEditingNote] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddingNote, setIsAddingNote] = useState(false)

  useEffect(() => {
    loadNotes()
  }, [lessonId])

  const loadNotes = () => {
    const savedNotes = localStorage.getItem(`notes_${lessonId}`) || '[]'
    try {
      setNotes(JSON.parse(savedNotes))
    } catch (error) {
      setNotes([])
    }
  }

  const saveNotes = (updatedNotes) => {
    localStorage.setItem(`notes_${lessonId}`, JSON.stringify(updatedNotes))
    setNotes(updatedNotes)
  }

  const addNote = () => {
    if (!newNote.title.trim() || !newNote.content.trim()) return

    const note = {
      id: Date.now().toString(),
      title: newNote.title.trim(),
      content: newNote.content.trim(),
      tags: newNote.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      lessonId,
      lessonTitle,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const updatedNotes = [...notes, note]
    saveNotes(updatedNotes)
    setNewNote({ title: '', content: '', tags: '' })
    setIsAddingNote(false)
  }

  const updateNote = (noteId, updatedData) => {
    const updatedNotes = notes.map(note => 
      note.id === noteId 
        ? { ...note, ...updatedData, updatedAt: new Date().toISOString() }
        : note
    )
    saveNotes(updatedNotes)
    setEditingNote(null)
  }

  const deleteNote = (noteId) => {
    const updatedNotes = notes.filter(note => note.id !== noteId)
    saveNotes(updatedNotes)
  }

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">My Notes</h3>
          <p className="text-sm text-gray-600">{lessonTitle}</p>
        </div>
        <Button 
          onClick={() => setIsAddingNote(true)}
          size="sm"
          className="flex items-center space-x-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Note</span>
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Add Note Form */}
      {isAddingNote && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Add New Note</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Note title..."
              value={newNote.title}
              onChange={(e) => setNewNote(prev => ({ ...prev, title: e.target.value }))}
            />
            <Textarea
              placeholder="Write your note here..."
              value={newNote.content}
              onChange={(e) => setNewNote(prev => ({ ...prev, content: e.target.value }))}
              rows={4}
            />
            <Input
              placeholder="Tags (comma separated)..."
              value={newNote.tags}
              onChange={(e) => setNewNote(prev => ({ ...prev, tags: e.target.value }))}
            />
            <div className="flex space-x-2">
              <Button onClick={addNote} size="sm">
                <Save className="w-4 h-4 mr-2" />
                Save Note
              </Button>
              <Button 
                onClick={() => {
                  setIsAddingNote(false)
                  setNewNote({ title: '', content: '', tags: '' })
                }}
                variant="outline" 
                size="sm"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notes List */}
      <div className="space-y-3">
        {filteredNotes.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                {searchTerm ? 'No notes found matching your search.' : 'No notes yet. Start taking notes to remember key concepts!'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredNotes.map(note => (
            <Card key={note.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                {editingNote === note.id ? (
                  <EditNoteForm 
                    note={note} 
                    onSave={(updatedData) => updateNote(note.id, updatedData)}
                    onCancel={() => setEditingNote(null)}
                  />
                ) : (
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{note.title}</h4>
                      <div className="flex space-x-1">
                        <Button
                          onClick={() => setEditingNote(note.id)}
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <Edit3 className="w-3 h-3" />
                        </Button>
                        <Button
                          onClick={() => deleteNote(note.id)}
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 text-sm mb-3 whitespace-pre-wrap">{note.content}</p>
                    
                    {note.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {note.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            <Tag className="w-2 h-2 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="w-3 h-3 mr-1" />
                      <span>Created {formatDate(note.createdAt)}</span>
                      {note.updatedAt !== note.createdAt && (
                        <span className="ml-2">• Updated {formatDate(note.updatedAt)}</span>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

function EditNoteForm({ note, onSave, onCancel }) {
  const [editData, setEditData] = useState({
    title: note.title,
    content: note.content,
    tags: note.tags.join(', ')
  })

  const handleSave = () => {
    if (!editData.title.trim() || !editData.content.trim()) return
    
    onSave({
      title: editData.title.trim(),
      content: editData.content.trim(),
      tags: editData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    })
  }

  return (
    <div className="space-y-3">
      <Input
        value={editData.title}
        onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
        placeholder="Note title..."
      />
      <Textarea
        value={editData.content}
        onChange={(e) => setEditData(prev => ({ ...prev, content: e.target.value }))}
        placeholder="Note content..."
        rows={3}
      />
      <Input
        value={editData.tags}
        onChange={(e) => setEditData(prev => ({ ...prev, tags: e.target.value }))}
        placeholder="Tags (comma separated)..."
      />
      <div className="flex space-x-2">
        <Button onClick={handleSave} size="sm">
          <Save className="w-4 h-4 mr-2" />
          Save
        </Button>
        <Button onClick={onCancel} variant="outline" size="sm">
          Cancel
        </Button>
      </div>
    </div>
  )
}

export default NoteTaking

