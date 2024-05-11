'use client'

import { action } from '@/actions'
import { DriverImportSchema } from '@/actions/driver/schema'
import { Shield } from '@/components/shield'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useToast } from '@/components/ui/use-toast'
import { useAction } from '@/hooks/use-action'
import { DownloadIcon, Loader2, UploadIcon } from 'lucide-react'
import * as React from 'react'
import * as XLSX from 'xlsx'
import { z } from 'zod'

export const ImportButton = () => {
  const { toast } = useToast()

  const { importMany } = action.driver()

  const { execute } = useAction(importMany, {
    onSuccess: () => {
      toast({
        title: 'Motoristas importados com sucesso',
        description: 'Os motoristas foram importados com sucesso! 🎉',
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao importar motoristas',
        description: error,
      })
    },
  })

  const handleFileSelect = () => {
    const fileInput = document.getElementById('file')
    fileInput?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (loading || !event?.target?.files?.length) return

    const fileTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv',
    ]

    const selectedFile = event.target.files[0]

    if (!selectedFile || !fileTypes.includes(selectedFile.type)) {
      toast({
        variant: 'destructive',
        title: 'Erro ao importar motoristas',
        description:
          'Tipo de arquivo inválido, selecione um arquivo do tipo .xls, .xlsx ou .csv e tente novamente',
      })
    } else {
      handleFileRead(selectedFile)
    }
  }

  const handleFileRead = (file: File) => {
    try {
      setLoading(true)

      const reader = new FileReader()

      reader.readAsArrayBuffer(file)

      reader.onload = async (event) => {
        if (!event?.target?.result) throw new Error()

        const workbook = XLSX.read(event.target.result, { type: 'array' })

        const sheetName = workbook.SheetNames[0]
        const sheet = workbook.Sheets[sheetName]

        const json = XLSX.utils.sheet_to_json(sheet)
        const data = z.array(DriverImportSchema).parse(json)

        await execute(data)

        setLoading(false)
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao importar motoristas',
        description:
          'Verifique se o dados do arquivo estão corretos e tente novamente',
      })

      setLoading(false)
    }
  }

  const [loading, setLoading] = React.useState(false)

  const downloadTemplate = () => {
    const link = document.createElement('a')
    link.href = '/import-templates/drivers.xlsx'
    link.download = 'Importação-Motoristas.xlsx'
    link.click()

    toast({
      title: 'Modelo baixado com sucesso',
      description: 'O modelo foi baixado com sucesso! 🎉',
    })
  }

  return (
    <Shield permission="driver.import">
      <input
        id="file"
        type="file"
        className="sr-only"
        onChange={handleFileChange}
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            {loading ? (
              <Loader2 className="mr-2 size-5 animate-spin" />
            ) : (
              <UploadIcon className="mr-2 size-5" />
            )}
            Importar
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Ações</DropdownMenuLabel>

          <DropdownMenuItem onClick={handleFileSelect} disabled={loading}>
            <UploadIcon className="mr-2 size-4" />
            Selecionar arquivo
          </DropdownMenuItem>

          <DropdownMenuItem onClick={downloadTemplate}>
            <DownloadIcon className="mr-2 size-4" />
            Baixar modelo
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Shield>
  )
}
