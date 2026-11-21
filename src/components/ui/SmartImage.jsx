import { useState } from 'react'
import { cn } from '../../lib/cn'

/**
 * Responsive product image with a 700/1400 webp srcset. Reserves its own
 * aspect ratio so nothing shifts while the image decodes.
 */
export function SmartImage({
  base,
  alt,
  width,
  height,
  ratio,
  className,
  imgClassName,
  priority = false,
  fit = 'cover',
  sizes = '(min-width: 1024px) 50vw, 100vw',
}) {
  const [loaded, setLoaded] = useState(false)
  const aspectRatio = ratio ?? (width && height ? width / height : undefined)

  return (
    <div
      className={cn('relative overflow-hidden bg-paper', className)}
      style={{ aspectRatio }}
    >
      <img
        decoding={priority ? 'sync' : 'async'}
        loading={priority ? 'eager' : 'lazy'}
        src={`${base}-700.webp`}
        srcSet={`${base}-700.webp 700w, ${base}-1400.webp 1400w`}
        sizes={sizes}
        alt={alt}
        width={width}
        height={height}
        onLoad={() => setLoaded(true)}
        className={cn(
          'block h-full w-full transition-[opacity,transform] duration-700 ease-precision',
          fit === 'contain' ? 'object-contain' : 'object-cover',
          loaded ? 'opacity-100' : 'opacity-0',
          imgClassName,
        )}
      />
    </div>
  )
}
