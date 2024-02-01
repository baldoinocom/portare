'use client'

import { importTruckAction } from '@/actions/truck/import'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { UploadIcon } from 'lucide-react'
import * as React from 'react'
import * as XLSX from 'xlsx'

export const ButtonImport = () => {
  const { toast } = useToast()

  const [loading, setLoading] = React.useState(false)

  const handleFileSelect = () => {
    const fileInput = document.getElementById('fileInput')
    fileInput?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (loading || !event?.target?.files?.length) throw new Error()

      const fileTypes = [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/csv',
      ]

      setLoading(true)

      const selectedFile = event.target.files[0]

      if (!selectedFile || !fileTypes.includes(selectedFile.type)) {
        return toast({
          variant: 'destructive',
          title: 'Erro ao importar',
          description: 'Arquivo inválido',
        })
      }

      const reader = new FileReader()
      reader.readAsArrayBuffer(selectedFile)
      reader.onload = async (event) => {
        if (!event?.target?.result) throw new Error()

        const workbook = XLSX.read(event.target.result, { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        const sheet = workbook.Sheets[sheetName]
        const json = XLSX.utils.sheet_to_json(sheet)

        const data = convertJson(json)

        await importTruckAction(data)

        toast({
          title: 'Importado com sucesso',
          description: 'Os caminhões foram importados com sucesso',
        })
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao importar',
        description: 'Não foi possível importar os caminhões',
      })
    } finally {
      setLoading(false)
    }
  }

  const convertJson = (json: unknown[]) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return json.map((item: any) => {
      if (!item.Placa) throw new Error('Placa não informada')

      return {
        vehicle: {
          licensePlate: item.Placa,
          year: item.Ano,
          model: item.Modelo,
          chassis: item.Chassi ? String(item.Chassi) : null,
          renavam: item.Renavam ? String(item.Renavam) : null,
          brand: item.Marca,
          axle: item.Eixo ? 4 : null,
          unitId: item.Frota === 'Unidade' ? 1 : null,
        },
        compressor: item.Compressor === 'SIM',
      }
    })
  }

  return (
    <Button variant="outline" onClick={handleFileSelect} disabled={loading}>
      <UploadIcon className="mr-1.5" />
      {loading ? 'Importando' : 'Importar'}
      <input
        id="fileInput"
        type="file"
        className="sr-only"
        onChange={handleFileChange}
      />
    </Button>
  )
}
