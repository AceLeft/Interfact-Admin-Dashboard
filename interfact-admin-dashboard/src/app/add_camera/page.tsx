'use client';
import { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../../FirebaseConfig';
import { useIntersections } from '../hooks/useIntersections';



export default function AddCamera() {

    const intersections = useIntersections();

    const noImage = 'https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg'

    const [formData, setFormData] = useState({
        id: '',
        name: '',
        latitude: '',
        longitude: '',
        imagepath: noImage,
        status: '',
        timestamp: ''
      });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
          })
    }

    const submitNewCamera = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const docRef = doc(db, 'intersections', formData.id);

            await setDoc(docRef, formData);


            setFormData({ id: '', name: '', latitude: '', longitude: '', imagepath: noImage, status: '', timestamp: ''});
          } catch (error) {
            console.error('Error adding document: ', error);
            alert('Failed to add camera. Please try again.');
          }
    }


    return(
        <div>
            <div className="camera-add-main">
                <div className="camera-add-left shadow">
                    <h1>Add Camera</h1>
                    <hr />
                    <form className="camera-add-form" action="" onSubmit={submitNewCamera}>
                        <label htmlFor="id">id</label>
                        <input id="id" type="text" onChange={handleChange} value={formData.id} required/>
                        <label htmlFor="name">name</label>
                        <input id="name" type="text" onChange={handleChange} value={formData.name} required/>
                        <label htmlFor="latitude">latitude</label>
                        <input id="latitude" type="text" onChange={handleChange} value={formData.latitude} required/>
                        <label htmlFor="logitude">longitude</label>
                        <input id="longitude" type="text" onChange={handleChange} value={formData.longitude} required/>
                        <button className="camera-add-form-submit">ADD</button>
                    </form>
                </div>

                <div className="camera-add-right shadow">
                    <div className="camera-list">
                        {intersections.map((item) => (
                            <div className="camera-list-item shadow" key={item.id}>
                                <h1>{item.id}</h1>
                                <img src={item.imagepath || "no-image.webp"} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};