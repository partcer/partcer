import { Outlet } from "react-router-dom";
import { Footer, Header, ScrollToTop, ScrollToTopIcon, SearchFormPopUp } from "./components";
import { Toaster } from "react-hot-toast";
import { usePopUp } from "./contexts/PopUpContextProvider";

function App() {
    const { isPopupOpen, closePopup } = usePopUp();
    const isSearchFormPopUpOpen = isPopupOpen('searchForm');
    return (
        <main className="bg-gray-50">
            <Header />
            <Outlet />
            <Footer />
            <Toaster />
            <ScrollToTop />
            <ScrollToTopIcon />
            {isSearchFormPopUpOpen && <SearchFormPopUp closePopup={closePopup} />}
        </main>
    )
}

export default App;