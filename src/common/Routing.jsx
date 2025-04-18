import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Stocks from '../stocks/Stocks';
import App from './App';

function Routing() {
    return (
        <>
        <BrowserRouter> 
            <Routes>
                <Route path={"/stocks"} element={<Stocks/>}/>
                <Route path={"/"} element={<App/>}/>
            </Routes>
        
        </BrowserRouter>
        </>
    )
}

export default Routing