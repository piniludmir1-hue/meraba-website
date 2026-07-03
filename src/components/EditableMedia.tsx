import { getCategoryCardImageSources } from '@/lib/categoryImage'

interface EditableMediaProps {
  src?: string
  alt?: string
  label: string
  className?: string
  showLabel?: boolean
  sizes?: string
  quality?: number
  unoptimized?: boolean
}

export default function EditableMedia({
  src,
  alt = '',
  label,
  className = '',
  showLabel = false,
  sizes = '(min-width: 1024px) 35vw, 100vw',
}: EditableMediaProps) {
  const imageSources = src ? getCategoryCardImageSources(src) : undefined

  return (
    <div className={`media-placeholder ${src ? 'has-media' : ''} ${className}`} aria-label={!src ? label : undefined}>
      {src && (
        <img
          src={imageSources?.src}
          srcSet={imageSources?.srcSet}
          alt={alt}
          sizes={sizes}
          decoding="async"
          className="category-rendered-image block h-full w-full object-cover"
        />
      )}
      {showLabel && <div className="placeholder-label">{label}</div>}
    </div>
  )
}
