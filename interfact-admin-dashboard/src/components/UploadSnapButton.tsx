import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCloudArrowUp } from "@fortawesome/free-solid-svg-icons"
import { SnapshotCategoryData } from "@/app/types/Firebase/snapshotFB"
import { saveSnapshotDataToFirebase } from "@/app/utils/saveSnapshotToFirebase"

interface UploadSnapButtonProps {
  data: SnapshotCategoryData | null
}

export function UploadSnapButton({ data }: UploadSnapButtonProps) {
  const [name, setName] = useState("")

  const handleUpload = async () => {
    const snapshotId = name.trim()
    if (!snapshotId) {
      console.error("You must enter a snapshot name")
      return
    }
    if (!data) {
      console.error("Missing snapshot data.")
      return
    }

    try {
      await saveSnapshotDataToFirebase(snapshotId, data)
      console.log(`Snapshot “${snapshotId}” uploaded successfully.`)
      setName("")
    } catch (error) {
      console.error("Error uploading snapshot:", error)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="peer inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 bg-primary"
        >
          <FontAwesomeIcon icon={faCloudArrowUp} className="text-xl text-muted-foreground" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-outfit">Upload Snapshot To Firebase</DialogTitle>
          <DialogDescription className="font-outfit">
            Enter a name to use as the document ID in Firestore.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right font-outfit">
              Snapshot Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-2 font-outfit"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              onClick={handleUpload}
              disabled={!name.trim() || !data}
            >
              Upload
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
