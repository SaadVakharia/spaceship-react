import { SITE_NAME } from '../../config/brand'
import '../../styles/layout.css'

export function Header() {
  return (
    <header className="site-header">
      <span className="site-header__brand">{SITE_NAME}</span>
    </header>
  )
}
