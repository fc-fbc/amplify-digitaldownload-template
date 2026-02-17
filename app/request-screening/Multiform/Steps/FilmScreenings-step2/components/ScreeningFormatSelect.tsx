"use client"

import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useTranslation } from "@/lib/hooks/useTranslation"
import { Card, CardContent } from "@/components/ui/card"

interface FormatOption {
  value: string;
  label: string;
  price?: string;
  notes?: string[];
}

interface ScreeningFormatSelectProps {
  format: string;
  mediaType?: "SPECIAL_PERMISSION" | "DIGITAL_DOWNLOAD";
  onFormatChange: (format: string) => void;
  error?: string;
  screeningId?: string;
}

export default function ScreeningFormatSelect({
  format,
  mediaType,
  onFormatChange,
  error,
  screeningId = ""
}: ScreeningFormatSelectProps) {
  const { t } = useTranslation();

  // All format options
  const allFormatOptions: FormatOption[] = [
    {
      value: "user-owned copy",
      label: t('form.screeningDetails.formatOwnCopy'),
      notes: [t('form.screeningDetails.alreadyOwn')]
    },
    {
      value: "rent a copy",
      label: t('form.screeningDetails.rentACopy'),
      price: t('form.screeningDetails.priceRentCopy'),
      notes: [t('form.screeningDetails.subjectToAvail')]
    },
    {
      value: "filmbankmedia download",
      label: t('form.screeningDetails.formatFBMDownload'),
      price: t('form.screeningDetails.fbmDownloadPrice'),
      notes: [t('form.screeningDetails.subjectToAvail')]
    },
    {
      value: "virtual screening room",
      label: t('form.screeningDetails.vsr'),
      price: "Price on Request",
      notes: [
        t('form.screeningDetails.subjectToAvail'),
        t('form.screeningDetails.additionalFees')
      ]
    }
  ];

  // Filter options based on media type
  const formatOptions = mediaType === "DIGITAL_DOWNLOAD"
    ? allFormatOptions.filter(opt => opt.value === "filmbankmedia download")
    : allFormatOptions;

  return (
    <div className="space-y-3">
      <Label className="text-sm font-semibold">
        {t('form.screeningDetails.format')} <span className="text-red-500">*</span>
      </Label>

      <RadioGroup
        onValueChange={onFormatChange}
        value={format}
      >
        <Card className="border-blue-200">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-blue-100 text-blue-800">
                    <th className="p-2 text-left font-medium border-b w-8"></th>
                    <th className="p-2 text-left font-medium border-b">Option</th>
                    <th className="p-2 text-left font-medium border-b">Price</th>
                    <th className="p-2 text-left font-medium border-b">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {formatOptions.map((formatOption) => (
                    <tr
                      key={formatOption.value}
                      className={`border-b hover:bg-blue-50 cursor-pointer ${format === formatOption.value ? 'bg-blue-50' : ''}`}
                      onClick={() => onFormatChange(formatOption.value)}
                    >
                      <td className="p-2 align-middle">
                        <RadioGroupItem
                          value={formatOption.value}
                          id={`format-${screeningId}-${formatOption.value}`}
                        />
                      </td>
                      <td className="p-2 align-middle">
                        <Label htmlFor={`format-${screeningId}-${formatOption.value}`} className="font-medium cursor-pointer">
                          {formatOption.label}
                        </Label>
                      </td>
                      <td className="p-2 align-middle text-gray-600">
                        {formatOption.price || "—"}
                      </td>
                      <td className="p-2 align-middle">
                        {formatOption.notes && formatOption.notes.map((note, index) => (
                          <div key={index} className="text-xs text-gray-500">
                            {note}
                          </div>
                        ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </RadioGroup>

      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
}
