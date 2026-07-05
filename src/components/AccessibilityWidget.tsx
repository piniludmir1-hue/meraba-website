'use client'

import { useEffect, useId, useState } from 'react'

type AccessibilitySettings = {
  textSize: number
  highContrast: boolean
  underlineLinks: boolean
  readableFont: boolean
  reduceMotion: boolean
}

const defaultSettings: AccessibilitySettings = {
  textSize: 0,
  highContrast: false,
  underlineLinks: false,
  readableFont: false,
  reduceMotion: false,
}

const storageKey = 'meraba-accessibility-settings'

function applySettings(settings: AccessibilitySettings) {
  const root = document.documentElement

  root.dataset.a11yText = settings.textSize === 1 ? 'large' : settings.textSize === 2 ? 'larger' : 'normal'
  root.dataset.a11yContrast = String(settings.highContrast)
  root.dataset.a11yLinks = String(settings.underlineLinks)
  root.dataset.a11yReadable = String(settings.readableFont)
  root.dataset.a11yMotion = String(settings.reduceMotion)
}

export default function AccessibilityWidget() {
  const panelId = useId()
  const [isOpen, setIsOpen] = useState(false)
  const [hasLoadedSettings, setHasLoadedSettings] = useState(false)
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings)

  useEffect(() => {
    const savedSettings = window.localStorage.getItem(storageKey)

    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings) as Partial<AccessibilitySettings>
        setSettings({ ...defaultSettings, ...parsedSettings })
      } catch {
        setSettings(defaultSettings)
      }
    }

    setHasLoadedSettings(true)
  }, [])

  useEffect(() => {
    if (!hasLoadedSettings) {
      return
    }

    applySettings(settings)
    window.localStorage.setItem(storageKey, JSON.stringify(settings))
  }, [hasLoadedSettings, settings])

  const updateSetting = (nextSettings: Partial<AccessibilitySettings>) => {
    setSettings((currentSettings) => ({ ...currentSettings, ...nextSettings }))
  }

  const resetSettings = () => {
    setSettings(defaultSettings)
  }

  return (
    <div className="accessibility-widget" aria-label="Accessibility tools">
      {isOpen && (
        <div id={panelId} className="accessibility-panel" role="dialog" aria-label="Accessibility options">
          <div className="flex items-start justify-between gap-5">
            <div>
              <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-meraba">Accessibility</p>
              <p className="mt-1 text-sm leading-6 text-gray-600">Adjust the site display.</p>
            </div>
            <button
              type="button"
              className="accessibility-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close accessibility options"
            >
              x
            </button>
          </div>

          <div className="mt-5 grid gap-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                className="accessibility-option"
                onClick={() => updateSetting({ textSize: Math.max(0, settings.textSize - 1) })}
                disabled={settings.textSize === 0}
              >
                Decrease text
              </button>
              <button
                type="button"
                className="accessibility-option"
                onClick={() => updateSetting({ textSize: Math.min(2, settings.textSize + 1) })}
                disabled={settings.textSize === 2}
              >
                Increase text
              </button>
            </div>

            <button
              type="button"
              className="accessibility-option"
              aria-pressed={settings.highContrast}
              onClick={() => updateSetting({ highContrast: !settings.highContrast })}
            >
              High contrast
            </button>
            <button
              type="button"
              className="accessibility-option"
              aria-pressed={settings.underlineLinks}
              onClick={() => updateSetting({ underlineLinks: !settings.underlineLinks })}
            >
              Underline links
            </button>
            <button
              type="button"
              className="accessibility-option"
              aria-pressed={settings.readableFont}
              onClick={() => updateSetting({ readableFont: !settings.readableFont })}
            >
              Readable font
            </button>
            <button
              type="button"
              className="accessibility-option"
              aria-pressed={settings.reduceMotion}
              onClick={() => updateSetting({ reduceMotion: !settings.reduceMotion })}
            >
              Pause animations
            </button>
            <button type="button" className="accessibility-reset" onClick={resetSettings}>
              Reset
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        className="accessibility-toggle"
        aria-label="Open accessibility options"
        aria-expanded={isOpen}
        aria-controls={isOpen ? panelId : undefined}
        onClick={() => setIsOpen((currentState) => !currentState)}
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="4.6" r="1.9" />
          <path d="M5.2 8.4h13.6M12 8.9v10.5M8.2 21l3.8-8.4L15.8 21" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  )
}
