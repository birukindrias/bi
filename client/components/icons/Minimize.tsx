import { ReactNode, SVGProps } from 'react'

//React.FC<{title:string}> to add custom props
const Minimize = (props: SVGProps<SVGSVGElement>)=> (
  <svg
    viewBox="0 0 43 21"
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    style={{
      fillRule: "evenodd",
      clipRule: "evenodd",
      strokeMiterlimit: 10,
    }}
    {...props}
  >
    <path
      d="M10.085 10.159h22.468"
      style={{
        fill: "none",
        fillRule: "nonzero",
        stroke: "inherit",
        strokeWidth: 2,
      }}
    />
  </svg>
)

export default Minimize
