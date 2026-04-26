import { useState } from "react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'

export function Testing() {
    const [selectedProduct, setSelectedProduct] = useState('')
    return (
        // <div>
        //     <Select value={selectedProduct} onValueChange={setSelectedProduct}>
        //         <SelectTrigger>
        //             <SelectValue placeholder="Select a fruit" />
        //         </SelectTrigger>
        //         <SelectContent>
        //             <SelectItem value="apple">apple</SelectItem>
        //             <SelectItem value="banana">banana</SelectItem>
        //             <SelectItem value="orange">orange</SelectItem>
        //         </SelectContent>
        //     </Select>
        //     {selectedProduct == 'apple' &&
        //         <AlertDialog>
        //             <AlertDialogTrigger><Button>Alert</Button></AlertDialogTrigger>
        //             <AlertDialogContent>
        //                 <AlertDialogHeader>
        //                     <AlertDialogTitle>This is {selectedProduct}</AlertDialogTitle>
        //                     <AlertDialogDescription>
        //                         This action cannot be undone. This will permanently delete your "{selectedProduct}" and remove your data from our servers.
        //                     </AlertDialogDescription>
        //                 </AlertDialogHeader>
        //                 <AlertDialogFooter>
        //                     <AlertDialogCancel>Cancel</AlertDialogCancel>
        //                 </AlertDialogFooter>
        //             </AlertDialogContent>
        //         </AlertDialog>
        //     }
        // </div>
        <></>
    )
}