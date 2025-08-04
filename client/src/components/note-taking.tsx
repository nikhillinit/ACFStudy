import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  NotebookPen, 
  Save, 
  Search, 
  Tag, 
  Calendar,
  BookOpen,
  Trash2,
  Edit3,
  Plus,
  Star,
  StarOff
} from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  topic?: string;
  lessonId?: string;
  lessonTitle?: string;
  isStarred?: boolean;
}

interface NoteTakingProps {
  lessonId?: string;
  lessonTitle?: string;
  topic?: string;
  onSave?: (note: Note) => void;
}

export function NoteTaking({ lessonId, lessonTitle, topic, onSave }: NoteTakingProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newTag, setNewTag] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = () => {
    // Load notes from localStorage (in real app, this would be from API)
    const savedNotes = localStorage.getItem('acf-notes');
    if (savedNotes) {
      const parsedNotes = JSON.parse(savedNotes).map((note: any) => ({
        ...note,
        createdAt: new Date(note.createdAt),
        updatedAt: new Date(note.updatedAt)
      }));
      setNotes(parsedNotes);
    }
  };

  const saveNotes = (updatedNotes: Note[]) => {
    localStorage.setItem('acf-notes', JSON.stringify(updatedNotes));
    setNotes(updatedNotes);
  };

  const createNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: lessonTitle || 'New Note',
      content: '',
      tags: topic ? [topic] : [],
      createdAt: new Date(),
      updatedAt: new Date(),
      topic,
      lessonId,
      lessonTitle,
      isStarred: false
    };
    setCurrentNote(newNote);
    setIsEditing(true);
  };

  const saveNote = () => {
    if (!currentNote) return;

    const updatedNote = {
      ...currentNote,
      updatedAt: new Date(),
      tags: [...selectedTags]
    };

    const existingIndex = notes.findIndex(n => n.id === updatedNote.id);
    let updatedNotes;

    if (existingIndex >= 0) {
      updatedNotes = [...notes];
      updatedNotes[existingIndex] = updatedNote;
    } else {
      updatedNotes = [...notes, updatedNote];
    }

    saveNotes(updatedNotes);
    setCurrentNote(updatedNote);
    setIsEditing(false);

    if (onSave) {
      onSave(updatedNote);
    }
  };

  const deleteNote = (noteId: string) => {
    const updatedNotes = notes.filter(n => n.id !== noteId);
    saveNotes(updatedNotes);
    if (currentNote?.id === noteId) {
      setCurrentNote(null);
      setIsEditing(false);
    }
  };

  const toggleStar = (noteId: string) => {
    const updatedNotes = notes.map(note => 
      note.id === noteId ? { ...note, isStarred: !note.isStarred } : note
    );
    saveNotes(updatedNotes);
  };

  const addTag = () => {
    if (newTag.trim() && !selectedTags.includes(newTag.trim())) {
      setSelectedTags([...selectedTags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  const allTags = Array.from(new Set(notes.flatMap(note => note.tags)));

  const editNote = (note: Note) => {
    setCurrentNote(note);
    setSelectedTags([...note.tags]);
    setIsEditing(true);
  };

  return (
    <div className="space-y-6">
      {/* Header with Search and New Note */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <NotebookPen className="w-5 h-5 text-blue-600" />
              <span>My Notes</span>
            </div>
            <Button onClick={createNewNote} size="sm" data-testid="button-new-note">
              <Plus className="w-4 h-4 mr-2" />
              New Note
            </Button>
          </CardTitle>
          <CardDescription>
            {lessonTitle ? `Notes for: ${lessonTitle}` : 'Organize your study notes and insights'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
            <Input
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              data-testid="input-note-search"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notes List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">All Notes ({filteredNotes.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredNotes.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <NotebookPen className="w-12 h-12 mx-auto mb-2 opacity-30" />
                  <p>No notes found. Create your first note!</p>
                </div>
              ) : (
                filteredNotes.map((note) => (
                  <div 
                    key={note.id} 
                    className={`p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                      currentNote?.id === note.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20' : ''
                    }`}
                    onClick={() => {
                      setCurrentNote(note);
                      setSelectedTags([...note.tags]);
                      setIsEditing(false);
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-sm line-clamp-1">{note.title}</h4>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleStar(note.id);
                          }}
                          className="h-6 w-6 p-0"
                        >
                          {note.isStarred ? (
                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                          ) : (
                            <StarOff className="w-3 h-3 text-gray-400" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            editNote(note);
                          }}
                          className="h-6 w-6 p-0"
                        >
                          <Edit3 className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNote(note.id);
                          }}
                          className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                      {note.content || 'No content'}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {note.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {note.tags.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{note.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3 mr-1" />
                        {note.updatedAt.toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Note Editor */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{isEditing ? 'Edit Note' : 'View Note'}</span>
              {currentNote && (
                <div className="flex space-x-2">
                  {!isEditing && (
                    <Button onClick={() => setIsEditing(true)} size="sm" variant="outline">
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  )}
                  {isEditing && (
                    <Button onClick={saveNote} size="sm" data-testid="button-save-note">
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                  )}
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {currentNote ? (
              <div className="space-y-4">
                {isEditing ? (
                  <>
                    <Input
                      placeholder="Note title..."
                      value={currentNote.title}
                      onChange={(e) => setCurrentNote({ ...currentNote, title: e.target.value })}
                      className="font-medium"
                      data-testid="input-note-title"
                    />
                    <Textarea
                      placeholder="Write your notes here..."
                      value={currentNote.content}
                      onChange={(e) => setCurrentNote({ ...currentNote, content: e.target.value })}
                      rows={10}
                      className="resize-none"
                      data-testid="textarea-note-content"
                    />
                    
                    {/* Tag Management */}
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Input
                          placeholder="Add tag..."
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addTag()}
                          className="flex-1"
                          data-testid="input-new-tag"
                        />
                        <Button onClick={addTag} size="sm" variant="outline">
                          <Tag className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedTags.map((tag) => (
                          <Badge 
                            key={tag} 
                            variant="secondary" 
                            className="cursor-pointer"
                            onClick={() => removeTag(tag)}
                          >
                            {tag} ×
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-medium">{currentNote.title}</h3>
                    <div className="prose prose-sm max-w-none text-sm">
                      {currentNote.content ? (
                        <pre className="whitespace-pre-wrap font-sans">{currentNote.content}</pre>
                      ) : (
                        <p className="text-muted-foreground italic">No content</p>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {currentNote.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="text-xs text-muted-foreground border-t pt-2">
                      Created: {currentNote.createdAt.toLocaleString()}{' '}
                      {currentNote.updatedAt.getTime() !== currentNote.createdAt.getTime() && (
                        <>• Updated: {currentNote.updatedAt.toLocaleString()}</>
                      )}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <NotebookPen className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p className="text-lg mb-2">No note selected</p>
                <p className="text-sm">Select a note from the list or create a new one</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default NoteTaking;