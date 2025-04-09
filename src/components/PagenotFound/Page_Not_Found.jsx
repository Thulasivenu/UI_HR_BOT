import { Link } from "react-router-dom"


const Page_Not_Found = () => {
    return(
        <>
            <div className="text-center">
                <p className="text-center">404 PAGE NOT FOUND...</p>
                <p>GOTO <Link to='/' className="underline text-green-700 font-bold">HOME</Link> PAGE</p>
            </div>
        </>
    )
}

export default Page_Not_Found