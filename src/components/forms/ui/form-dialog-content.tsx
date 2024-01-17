import { DialogContent } from '@/components/ui/dialog'

export const FormDialogContent = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return <DialogContent className="sm:max-w-[425px]">{children}</DialogContent>
}
