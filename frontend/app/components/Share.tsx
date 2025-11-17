import { Button } from '@/components/ui/button'
import { Share, Share2, Share2Icon } from 'lucide-react'
import {RWebShare} from 'react-web-share'

interface RWebShareProps{ 
    url: string,
    title: string,
    text: string
}
export const ShareButton = ({url, title, text} : RWebShareProps) => {

    return <RWebShare data={{text: text, url: url, title: title}} onClick={() => console.log("Shared Successfully")}>

        <Button size="sm" variant="outline">
            <Share className='h-4 w-4' />
        </Button>
    </RWebShare>
}