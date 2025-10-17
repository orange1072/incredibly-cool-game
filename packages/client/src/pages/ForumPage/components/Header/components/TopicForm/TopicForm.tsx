import { PixelButton } from '@/components/PixelButton'
import styles from './TopicForm.module.scss'
import { Plus } from 'lucide-react'

const TopicForm = () => {
  return (
    <>
      <PixelButton variant="primary" icon={<Plus className={styles.icon} />}>
        New Topic
      </PixelButton>
    </>
    /*         <Dialog>
          <DialogTrigger asChild>
            <PixelButton variant="primary" icon={<Plus className="w-4 h-4" />}>
              New Topic
            </PixelButton>
          </DialogTrigger>
          <DialogContent className="bg-[#1a1e1c] border-2 border-[#2fb8cc] max-w-2xl metal-panel">
            <div className="scanline absolute inset-0 pointer-events-none opacity-20" />
            <DialogHeader className="relative z-10">
              <DialogTitle className="stalker-text text-[#a8b5a8] tracking-wider uppercase">
                Create New Topic
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4 relative z-10">
              <TerminalInput
                label="Title"
                placeholder="Topic title..."
                value={newTopicTitle}
                onChange={(e) => setNewTopicTitle(e.target.value)}
              />
              <div>
                <label className="block text-[#6a7a6a] text-xs tracking-[0.15em] uppercase font-mono mb-1.5">
                  Message
                </label>
                <Textarea
                  placeholder="Describe your topic..."
                  value={newTopicContent}
                  onChange={(e) => setNewTopicContent(e.target.value)}
                  className="bg-[#1a1e1c]/80 border-2 border-[#2d3a2e] focus:border-[#2fb8cc] text-[#a8b5a8] font-mono min-h-[150px]"
                />
              </div>
              <PixelButton
                variant="primary"
                className="w-full"
                icon={<Send className="w-4 h-4" />}
              >
                Publish
              </PixelButton>
            </div>
          </DialogContent>
        </Dialog> */
  )
}

export default TopicForm
