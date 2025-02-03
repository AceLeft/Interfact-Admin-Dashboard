'use client';
import { useRouter } from 'next/navigation';
import { useIntersections } from "../hooks/useIntersections";
export default function Cities() {

    const router = useRouter();
    const intersectionCount = useIntersections()

    const toCityDashboard = () =>{
        router.push("/dashboard")
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