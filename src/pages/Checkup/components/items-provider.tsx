// "use client"

// import type React from "react"

// import { useState } from "react"
// import { Pill, Plus, Minus, Search, Package, Badge as Bandage, Stethoscope, Box, Trash2 } from "lucide-react"
// import { HealthItem, ItemCategory, ProvidedItem } from "@/types/checkup"
// import { healthItems } from "../mock-data"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/card/Card"
// import Button from "@/components/buttons/Button"

// interface ItemsProviderProps {
//   providedItems: ProvidedItem[]
//   onChange: (items: ProvidedItem[]) => void
// }

// const categoryConfig: Record<ItemCategory, { label: string; icon: React.ReactNode; color: string }> = {
//   medicine: { label: "Medicine", icon: <Pill className="h-4 w-4" />, color: "bg-rose-100 text-rose-700" },
//   first_aid: { label: "First Aid", icon: <Bandage className="h-4 w-4" />, color: "bg-amber-100 text-amber-700" },
//   equipment: { label: "Equipment", icon: <Stethoscope className="h-4 w-4" />, color: "bg-sky-100 text-sky-700" },
//   supply: { label: "Supply", icon: <Box className="h-4 w-4" />, color: "bg-emerald-100 text-emerald-700" },
// }

// export function ItemsProvider({ providedItems, onChange }: ItemsProviderProps) {
//   const [isOpen, setIsOpen] = useState(false)
//   const [searchTerm, setSearchTerm] = useState("")
//   const [selectedCategory, setSelectedCategory] = useState<ItemCategory | "all">("all")

//   const filteredItems = healthItems.filter((item) => {
//     const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
//     const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
//     return matchesSearch && matchesCategory
//   })

//   const handleAddItem = (item: HealthItem) => {
//     const existingIndex = providedItems.findIndex((p) => p.item.id === item.id)
//     if (existingIndex >= 0) {
//       const updated = [...providedItems]
//       updated[existingIndex].quantity += 1
//       onChange(updated)
//     } else {
//       onChange([...providedItems, { item, quantity: 1 }])
//     }
//   }

//   const handleUpdateQuantity = (itemId: string, delta: number) => {
//     const updated = providedItems
//       .map((p) => {
//         if (p.item.id === itemId) {
//           const newQty = p.quantity + delta
//           return newQty > 0 ? { ...p, quantity: newQty } : null
//         }
//         return p
//       })
//       .filter(Boolean) as ProvidedItem[]
//     onChange(updated)
//   }

//   const handleRemoveItem = (itemId: string) => {
//     onChange(providedItems.filter((p) => p.item.id !== itemId))
//   }

//   const categories: (ItemCategory | "all")[] = ["all", "medicine", "first_aid", "supply", "equipment"]

//   return (
//     <Card>
//       <CardHeader className="pb-4">
//         <div className="flex items-center justify-between">
//           <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-800">
//             <Package className="h-5 w-5 text-sky-600" />
//             Items Provided
//           </CardTitle>
//           {/* <Dialog open={isOpen} onOpenChange={setIsOpen}>
//             <DialogTrigger asChild>
//               <Button size="sm" className="bg-sky-600 hover:bg-sky-700">
//                 <Plus className="mr-1 h-4 w-4" />
//                 Add Item
//               </Button>
//             </DialogTrigger>
//             <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
//               <DialogHeader>
//                 <DialogTitle>Select Items to Provide</DialogTitle>
//               </DialogHeader>
//               <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
//                 <div className="relative">
//                   <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
//                   <Input
//                     placeholder="Search items..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className="pl-10"
//                   />
//                 </div>

//                 <div className="flex flex-wrap gap-2">
//                   {categories.map((cat) => (
//                     <Button
//                       key={cat}
//                       variant={selectedCategory === cat ? "default" : "outline"}
//                       size="sm"
//                       onClick={() => setSelectedCategory(cat)}
//                       className={selectedCategory === cat ? "bg-sky-600 hover:bg-sky-700" : ""}
//                     >
//                       {cat === "all" ? "All" : categoryConfig[cat].label}
//                     </Button>
//                   ))}
//                 </div>

//                 <div className="flex-1 overflow-y-auto space-y-2 pr-2">
//                   {filteredItems.map((item) => {
//                     const config = categoryConfig[item.category]
//                     const provided = providedItems.find((p) => p.item.id === item.id)
//                     return (
//                       <div
//                         key={item.id}
//                         className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3 hover:bg-slate-50"
//                       >
//                         <div className="flex items-center gap-3">
//                           <div className={`rounded-lg p-2 ${config.color}`}>{config.icon}</div>
//                           <div>
//                             <p className="font-medium text-slate-800">{item.name}</p>
//                             <div className="flex items-center gap-2 text-xs text-slate-500">
//                               <span>
//                                 Stock: {item.stockQuantity} {item.unit}s
//                               </span>
//                               {item.description && (
//                                 <>
//                                   <span>•</span>
//                                   <span>{item.description}</span>
//                                 </>
//                               )}
//                             </div>
//                           </div>
//                         </div>
//                         <div className="flex items-center gap-2">
//                           {provided && (
//                             <Badge variant="secondary" className="bg-sky-100 text-sky-700">
//                               {provided.quantity} added
//                             </Badge>
//                           )}
//                           <Button
//                             size="sm"
//                             variant="outline"
//                             onClick={() => handleAddItem(item)}
//                             disabled={item.stockQuantity === 0}
//                           >
//                             <Plus className="h-4 w-4" />
//                           </Button>
//                         </div>
//                       </div>
//                     )
//                   })}
//                   {filteredItems.length === 0 && <div className="py-8 text-center text-slate-500">No items found</div>}
//                 </div>
//               </div>
//             </DialogContent>
//           </Dialog> */}
//         </div>
//       </CardHeader>
//       <CardContent>
//         {providedItems.length === 0 ? (
//           <div className="rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 py-8 text-center">
//             <Package className="mx-auto h-10 w-10 text-slate-300" />
//             <p className="mt-2 text-sm text-slate-500">No items provided yet</p>
//             <p className="text-xs text-slate-400">Click "Add Item" to provide medicine or supplies</p>
//           </div>
//         ) : (
//           <div className="space-y-3">
//             {providedItems.map((provided) => {
//               const config = categoryConfig[provided.item.category]
//               return (
//                 <div
//                   key={provided.item.id}
//                   className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3"
//                 >
//                   <div className="flex items-center gap-3">
//                     <div className={`rounded-lg p-2 ${config.color}`}>{config.icon}</div>
//                     <div>
//                       <p className="font-medium text-slate-800">{provided.item.name}</p>
//                       <p className="text-xs text-slate-500">
//                         {provided.quantity} {provided.item.unit}
//                         {provided.quantity > 1 ? "s" : ""}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <div className="flex items-center rounded-lg border border-slate-200">
//                       <Button
//                         className="h-8 w-8 rounded-r-none"
//                         onClick={() => handleUpdateQuantity(provided.item.id, -1)}
//                       >
//                         <Minus className="h-4 w-4" />
//                       </Button>
//                       <div className="flex h-8 w-10 items-center justify-center border-x border-slate-200 text-sm font-medium">
//                         {provided.quantity}
//                       </div>
//                       <Button
//                         className="h-8 w-8 rounded-l-none"
//                         onClick={() => handleUpdateQuantity(provided.item.id, 1)}
//                         disabled={provided.quantity >= provided.item.stockQuantity}
//                       >
//                         <Plus className="h-4 w-4" />
//                       </Button>
//                     </div>
//                     <Button
//                       className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600"
//                       onClick={() => handleRemoveItem(provided.item.id)}
//                     >
//                       <Trash2 className="h-4 w-4" />
//                     </Button>
//                   </div>
//                 </div>
//               )
//             })}
//             <div className="mt-4 flex items-center justify-between rounded-lg bg-slate-100 px-4 py-2">
//               <span className="text-sm font-medium text-slate-600">Total Items</span>
//               <span className="text-sm font-semibold text-slate-800">
//                 {providedItems.reduce((sum, p) => sum + p.quantity, 0)} item(s)
//               </span>
//             </div>
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   )
// }
