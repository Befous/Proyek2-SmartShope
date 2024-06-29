import React, { useContext, useEffect, useState } from 'react'
import Layout from '../../components/layout/Layout'
import myContext from '../../context/data/myContext';
import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { doc, getDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { addToCart } from '../../redux/cartSlice';
import { fireDB } from '../../firebase/FirebaseConfig';

function ProductInfo() {
    const context = useContext(myContext);
    const { loading, setLoading, user } = context;

    const [products, setProducts] = useState('')
    const params = useParams()

    const getProductData = async () => {
        setLoading(true)
        try {
            const productTemp = await getDoc(doc(fireDB, "products", params.id))
            setProducts(productTemp.data());
            setLoading(false)
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

    useEffect(() => {
        getProductData()
    }, [])

    const dispatch = useDispatch()
    const cartItems = useSelector((state) => state.cart)

    const addCart = (product) => {
        if (user && user.length > 0) {
            dispatch(addToCart(product));
            toast.success('Add to cart');
        } else {
            toast.warning('Please login to add to cart');
        }
    };

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems])

    return (
        <Layout>
            <section className="text-gray-600 body-font overflow-hidden">
                <div className="container px-5 py-10 mx-auto">
                    {products && 
                    <div className="lg:w-4/5 mx-auto flex flex-wrap">
                        <img
                            alt="ecommerce"
                            className="lg:w-1/3 w-full lg:h-auto  object-cover object-center rounded"
                            src={products.imageUrl}
                        />
                        <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
                            <h2 className="text-sm title-font text-gray-500 tracking-widest">
                                SmartShop
                            </h2>
                            <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">
                                {products.title}
                            </h1>
                            <p className="leading-relaxed border-b-2 mb-5 pb-5">
                                {products.description}
                            </p>

                            <div className="flex">
                                <span className="title-font font-medium text-2xl text-gray-900">
                                Rp. {products.price}
                                </span>
                                <button id='addtocart' onClick={()=>addCart(products)} className="flex ml-auto text-white bg-yellow-500 border-0 py-2 px-6 focus:outline-none hover:bg-yellow-600 rounded">
                                    Add To Cart
                                </button>
                            </div>
                        </div>
                    </div>}
                </div>
            </section>

        </Layout>
    )
}

export default ProductInfo

