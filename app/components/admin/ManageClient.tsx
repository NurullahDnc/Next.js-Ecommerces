"use client"
import firebaseApp from "@/libs/firebase"
import { DataGrid, GridColDef } from "@mui/x-data-grid"
import { Product } from "@prisma/client"
import axios from "axios"
import { deleteObject, getStorage, ref } from "firebase/storage"
import { useRouter } from "next/navigation"
import { useCallback } from "react"
import toast from "react-hot-toast"

interface ManageClientProps {
    products: Product[]
}
const ManageClient:React.FC<ManageClientProps> = ({products}) => {
    const storage = getStorage(firebaseApp)
    const router = useRouter()
    let rows: any = []

    //product varmı, product map don degerleri rows degiskenine at
    if(products){
      rows = products.map((product) => {
        return {
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category,
            brand: product.brand,
            inStock: product.inStock,
            image: product.image
        }
      })
    }

    //columsn duzenle, id= bicimlndir
    const columns: GridColDef[] = [
        {field: "id", headerName: "ID", width: 150},
        {field: "name", headerName: "Name", width: 150},
        {field: "description", headerName: "description", width: 250},
        {field: "price", headerName: "Price", width: 150},
        {field: "category", headerName: "Category", width: 150},
        {field: "brand", headerName: "Brand", width: 150},
        {field: "inStock", 
           headerName: "Brand", 
           width: 100,
           renderCell: (params) => {
            return (
                <div>
                    {params.row.inStock == true ? "Stokta Mevcut" : "Stokta Mevcut Değil"}
                </div>
            )
           }
        }, 
        {field: "actions", 
           headerName: "Action", 
           width: 100,
           renderCell: (params) => {
            return (
                //ürünün id ve resmi paramete olarak gonderiyoruz iki taraftan silmesi icin
                <button onClick={() => handleDelete(params.row.id, params.row.image)} className="mx-4 text-red-500 cursor-pointer ">
                    Sil 
                </button>
            )
           }
        },
    ]

    const handleDelete = useCallback(async (id: string, image: any) => {
        toast.success('sildirme işlemi icin bekleyin...')
        const handleDeleteImg = async() => {
            try {
                //storage firebaseApp den geliyor,             // Storage'dan seçilen fotoğrafı silme
                const imageRef = ref(storage, image)
                await deleteObject(imageRef)
                // console.log(imageRef);

            } catch (error) {
            //    return console.log("bir hata mevcut", error) 
               toast.error("bir hata mevcut gorsel ")
            }
            // console.log(image,"params.row.image");

            
        }
        await handleDeleteImg();
        //istek atıyoruz delete: id gore     // Ürünü silme için server tarafına DELETE isteği gönderme
        axios.delete(`/api/product/${id}`)
        .then(() => {
          toast.success('sildirme işlemi basarılı')
          router.refresh();
        })
        .catch((error: any) => {
            toast.error("ürün silinirken bir hata Oluştu")
            
        })
        // console.log(image,"params.row.image");

    }, [])

    
  return (
    //*material-ui  kutuphanesi table kulanıldı

    <div>
        <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
                pagination: {
                paginationModel: { page: 0, pageSize: 5 },
                },
            }}
            pageSizeOptions={[5, 10]}
            checkboxSelection
            />
    </div>
  )
}

export default ManageClient