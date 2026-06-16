import React from 'react'
import Feature from './Feature/Feature'

const normalize = (value) =>
  String(value || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')

const findText = (data, template) => {
  const match = (data || []).find((item) => {
    const values = [
      item?.icon,
      item?.titleAr,
      item?.title_ar,
      item?.titleEn,
      item?.title_en,
    ].map(normalize)

    return values.some((value) => value && template.aliases.includes(value))
  })

  return {
    textAr: match?.textAr || match?.text_ar || match?.value_ar || '',
    textEn: match?.textEn || match?.text_en || match?.value_en || '',
    icon: match?.icon || undefined,
  }
}

const featureTemplates = [
  {
    key: 'level',
    titleAr: 'المستوى',
    titleEn: 'Level',
    aliases: ['level', 'difficulty', 'المستوى', 'مستوى', 'المستوي'],
    icon: (
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <path d="M12 52h40" />
        <path d="M16 52V38" />
        <path d="M26 52V30" />
        <path d="M36 52V22" />
        <path d="M46 52V14" />
      </svg>
    ),
  },
  {
    key: 'prep_time',
    titleAr: 'وقت التحضير',
    titleEn: 'Prep Time',
    aliases: ['prep_time', 'prep time', 'preparation time', 'وقت التحضير', 'وقت الاعداد', 'وقت الإعداد'],
    icon: (
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <circle cx="32" cy="32" r="24" />
        <path d="M32 18v16h13" />
        <path d="M21 8h22" />
      </svg>
    ),
  },
  {
    key: 'cooking_time',
    titleAr: 'وقت الطبخ',
    titleEn: 'Cooking Time',
    aliases: ['cooking_time', 'cooking time', 'cook time', 'وقت الطبخ'],
    icon: (
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <circle cx="32" cy="32" r="24" />
        <path d="M32 18v16h12" />
        <path d="M20 9 15 4" />
        <path d="M44 9 49 4" />
      </svg>
    ),
  },
  {
    key: 'servings',
    titleAr: 'عدد الأفراد',
    titleEn: 'Servings',
    aliases: ['servings', 'serving', 'عدد الأفراد', 'عدد الافراد', 'التقديم', 'خدمة'],
    icon: (
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <circle cx="32" cy="20" r="8" />
        <path d="M18 54c2-12 8-18 14-18s12 6 14 18" />
        <circle cx="16" cy="26" r="6" />
        <path d="M6 54c1-9 5-14 11-16" />
        <circle cx="48" cy="26" r="6" />
        <path d="M58 54c-1-9-5-14-11-16" />
      </svg>
    ),
  },
]

const Featues = ({ data }) => {
  const fixedFeatures = featureTemplates.map((template) => ({
    ...template,
    ...findText(data, template),
  }))

  return (
    <div className='features rowDiv'>
      {
        fixedFeatures.map((item) => {
          return (
            <Feature item={item} key={item.key} />
          )
        })
      }
    </div>
  )
}

export default Featues
