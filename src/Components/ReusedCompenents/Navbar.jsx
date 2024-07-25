const Navbar = () => {


return(
    <div class="flex flex-wrap -mx-3 removable">
                <div class="w-full max-w-full px-3 mb-4 sm:w-full sm:flex-none">
                    <div class="border-black/12.5 shadow-soft-xl relative flex h-full min-w-0 flex-col break-words rounded-2xl border-0 border-solid bg-white bg-clip-border p-4 mb-4">
                        <div class="relative h-full overflow-hidden bg-cover py-6 rounded-xl" style={{backgroundImage: "url('https://images.unsplash.com/photo-1655635643532-fa9ba2648cbe?ixlib=rb-1.2.1&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;w=2232&amp;q=80')"}}>
                            <span class="absolute top-0 left-0 w-full h-full bg-center bg-cover bg-gradient-to-tl from-gray-900 to-slate-800 opacity-80"></span>
                            <div class="relative z-10 flex flex-col flex-auto h-full p-4">
                                <h2 class="pt-2 mb-6 font-bold text-white">Discover, create and sell <br/> your own NFTs!</h2>
                                <a class="mt-auto mb-0 font-semibold leading-normal text-white group text-size-sm" href="javascript:;">
                                    Read More
                                    <i class="fas fa-arrow-right ease-bounce text-size-sm group-hover:translate-x-1.25 ml-1 leading-normal transition-all duration-200" aria-hidden="true" data-selected="selected-icon-hover"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
)

}

export default Navbar;
