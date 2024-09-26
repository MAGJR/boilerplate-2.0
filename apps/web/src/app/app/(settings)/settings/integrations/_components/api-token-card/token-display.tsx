import { Button } from '@design-system/react/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@design-system/react/components/ui/tooltip'
import { cn } from '@design-system/react/helpers/cn'
import { useBoolean } from '@design-system/react/hooks/use-boolean'
import { useClipboard } from '@design-system/react/hooks/use-clipboard'
import { Check, Copy, Eye, EyeOff, HelpCircle } from 'lucide-react'

interface TokenDisplayProps {
  label: string
  token: string
  helpText: string
}

export function TokenDisplay({ label, token, helpText }: TokenDisplayProps) {
  const tokenClipboard = useClipboard(token)
  const tokenIsVisible = useBoolean({ defaultValue: false, timeout: 5000 })

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <span className="font-semibold">{label}</span>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <HelpCircle className="w-4 h-4" />
            </TooltipTrigger>
            <TooltipContent>
              <p>{helpText}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="flex items-center space-x-2">
        <strong
          className={cn([
            'transition-all ease-in-out duration-700 line-clamp-1',
            tokenIsVisible.value
              ? ''
              : 'text-transparent bg-clip-text bg-gradient-to-r from-gray-500/80 bg-background blur-sm pointer-events-none',
          ])}
        >
          {token}
        </strong>
        <Button size="icon" variant="outline" onClick={tokenIsVisible.onToggle}>
          {tokenIsVisible.value ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
        </Button>
        <Button size="icon" variant="outline" onClick={tokenClipboard.onCopy}>
          {tokenClipboard.isCopied ? (
            <Check className="w-4 h-4" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </Button>
      </div>
    </div>
  )
}
