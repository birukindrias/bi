import * as React from "react"
import { SWRConfig } from "swr"
const swrConfig = {
 revalidateOnFocus: false,
 shouldRetryOnError: false
}
type Props = {
  children: React.ReactNode
}
// SWR configuration HOC
export const SWRConfigurationProvider: React.FC<Props> = ({ children }) => <SWRConfig value={swrConfig}>{children}</SWRConfig>
