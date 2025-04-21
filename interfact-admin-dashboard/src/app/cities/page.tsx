'use client';
import { useRouter, usePathname } from 'next/navigation';
import { useIntersections } from "../hooks/useIntersections";
import { animateToPage, isPageAnimating } from '@/app/transition';
export default function Cities() {

    const router = useRouter();
    const pathname = usePathname();
    const intersectionCount = useIntersections()

    const toCityDashboard = () =>{
        if (isPageAnimating()) return;

         animateToPage(router, '/dashboard', pathname);
    }

    return (
        <div>
            <div className="cities-main">
                <h1>Cities</h1>
                <div onClick={toCityDashboard} className="cities-container">
                    <div className="city-item shadow">
                        <div className="city-item-text1">Muncie</div>
                        <hr />
                        <div className="city-item-text2">Intersections | {intersectionCount.length}</div>   
                    </div>
                </div>
            </div>
        </div>
    )
}