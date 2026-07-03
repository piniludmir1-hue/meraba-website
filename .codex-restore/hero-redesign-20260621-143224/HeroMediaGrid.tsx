'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

interface HeroMediaGridProps {
  mode: 'separate' | 'continuous'
  mainImage?: string
  mainImageAlt?: string
  sideImage1?: string
  sideImage1Alt?: string
  sideImage2?: string
  sideImage2Alt?: string
  sideImage3?: string
  sideImage3Alt?: string
  continuousImage?: string
  continuousImageAlt?: string
}

interface CropStyle {
  backgroundSize: string
  backgroundPosition: string
}

const emptyCrop: CropStyle = {
  backgroundSize: 'cover',
  backgroundPosition: 'center',
}

export default function HeroMediaGrid({
  mode,
  mainImage,
  mainImageAlt,
  sideImage1,
  sideImage1Alt,
  sideImage2,
  sideImage2Alt,
  sideImage3,
  sideImage3Alt,
  continuousImage,
  continuousImageAlt,
}: HeroMediaGridProps) {
  const gridRef = useRef<HTMLDivElement>(null)
  const cellRefs = useRef<Array<HTMLDivElement | null>>([])
  const layerRefs = useRef<Array<HTMLDivElement | null>>([])
  const [cropStyles, setCropStyles] = useState<CropStyle[]>([
    emptyCrop,
    emptyCrop,
    emptyCrop,
    emptyCrop,
  ])
  const [cropsReady, setCropsReady] = useState(false)
  const isContinuousMode = mode === 'continuous'
  const useContinuousImage = isContinuousMode && Boolean(continuousImage)

  useEffect(() => {
    if (!useContinuousImage || !continuousImage || !gridRef.current) return

    setCropsReady(false)
    const sourceImage = new window.Image()

    const updateCrops = () => {
      const grid = gridRef.current
      if (!grid || !sourceImage.naturalWidth || !sourceImage.naturalHeight) return

      const gridRect = grid.getBoundingClientRect()
      const scale = Math.max(
        gridRect.width / sourceImage.naturalWidth,
        gridRect.height / sourceImage.naturalHeight
      )
      const renderedWidth = sourceImage.naturalWidth * scale
      const renderedHeight = sourceImage.naturalHeight * scale
      const imageOffsetX = (gridRect.width - renderedWidth) / 2
      const imageOffsetY = (gridRect.height - renderedHeight) / 2

      setCropStyles(
        layerRefs.current.map((layer) => {
          if (!layer) return emptyCrop

          const layerRect = layer.getBoundingClientRect()
          const layerOffsetX = layerRect.left - gridRect.left
          const layerOffsetY = layerRect.top - gridRect.top

          return {
            backgroundSize: `${renderedWidth}px ${renderedHeight}px`,
            backgroundPosition: `${imageOffsetX - layerOffsetX}px ${imageOffsetY - layerOffsetY}px`,
          }
        })
      )
      setCropsReady(true)
    }

    sourceImage.onload = updateCrops
    sourceImage.src = continuousImage

    const observer = new ResizeObserver(updateCrops)
    observer.observe(gridRef.current)
    cellRefs.current.forEach((cell) => cell && observer.observe(cell))
    layerRefs.current.forEach((layer) => layer && observer.observe(layer))

    return () => observer.disconnect()
  }, [continuousImage, useContinuousImage])

  const continuousLayer = (index: number) =>
    useContinuousImage ? (
      <div
        ref={(layer) => { layerRefs.current[index] = layer }}
        className={`hero-media-image hero-media-continuous-image absolute inset-0 opacity-90 ${cropsReady ? '' : 'invisible'}`}
        style={{
          backgroundImage: `url(${continuousImage})`,
          ...cropStyles[index],
        }}
        role="img"
        aria-label={continuousImageAlt || 'MERABA continuous operational product supply visual'}
      />
    ) : null

  return (
    <div
      ref={gridRef}
      className={`hero-media-grid relative grid md:grid-cols-[1.45fr_0.85fr] ${isContinuousMode ? 'hero-media-grid-continuous' : ''}`}
    >
      <div
        ref={(cell) => { cellRefs.current[0] = cell }}
        className="media-placeholder hero-media-panel hero-media-main min-h-[460px] border-white/15 shadow-[0_36px_100px_rgba(0,0,0,0.30)] md:min-h-[720px]"
      >
        {continuousLayer(0)}
        {!isContinuousMode && mainImage && (
          <div
            className="hero-media-image absolute inset-0 bg-cover bg-center opacity-90"
            style={{ backgroundImage: `url(${mainImage})` }}
            role="img"
            aria-label={mainImageAlt || 'MERABA operational food-service supply'}
          />
        )}
        <Image
          src="/brand/meraba-icon.png"
          alt=""
          width={1254}
          height={1254}
          aria-hidden="true"
          className="absolute right-8 top-8 z-10 h-20 w-20 object-contain opacity-[0.07] mix-blend-multiply md:h-28 md:w-28"
        />
      </div>

      <div className="hero-media-stack grid">
        <div
          ref={(cell) => { cellRefs.current[1] = cell }}
          className="media-placeholder hero-media-panel hero-media-detail min-h-[210px] border-white/15 md:min-h-[300px]"
        >
          {continuousLayer(1)}
          {!isContinuousMode && sideImage1 && <div className="hero-media-image hero-media-image-detail absolute inset-0 bg-cover opacity-55 [background-position:68%_62%]" style={{ backgroundImage: `url(${sideImage1})` }} role="img" aria-label={sideImage1Alt || 'MERABA operational product detail'} />}
          <div className="absolute bottom-6 left-6 z-10 h-px w-12 bg-white/60" />
        </div>
        <div
          ref={(cell) => { cellRefs.current[2] = cell }}
          className="media-placeholder hero-media-panel hero-media-detail min-h-[200px] border-white/15 md:min-h-[235px]"
        >
          {continuousLayer(2)}
          {!isContinuousMode && sideImage2 && <div className="hero-media-image hero-media-image-detail absolute inset-0 bg-cover opacity-50 [background-position:86%_82%]" style={{ backgroundImage: `url(${sideImage2})` }} role="img" aria-label={sideImage2Alt || 'MERABA operational supply detail'} />}
          <div className="absolute bottom-6 left-6 z-10 h-px w-12 bg-white/60" />
        </div>
        <div
          ref={(cell) => { cellRefs.current[3] = cell }}
          className="media-placeholder hero-media-panel hero-media-detail min-h-[170px] border-white/15 md:min-h-[185px]"
        >
          {continuousLayer(3)}
          {!isContinuousMode && sideImage3 && <div className="hero-media-image hero-media-image-detail absolute inset-0 bg-cover opacity-45 [background-position:48%_78%]" style={{ backgroundImage: `url(${sideImage3})` }} role="img" aria-label={sideImage3Alt || 'MERABA meal-service product detail'} />}
          <div className="absolute bottom-6 left-6 z-10 h-px w-12 bg-white/60" />
        </div>
      </div>
    </div>
  )
}
