'use client';
import { useRouter } from 'next/navigation';

export default function cities() {

    const router = useRouter();

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
                        <div className="city-item-text2">Intersections | 4</div>   
                    </div>
                </div>
            </div>
        </div>
    )
}