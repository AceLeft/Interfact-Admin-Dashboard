import '@testing-library/jest-dom';
import { render, fireEvent } from '@testing-library/react';
import React from 'react';
import AddCamera from '../src/app/add_camera/page.tsx'
import { useIntersections } from '../src/app/hooks/useIntersections';
import { describe } from 'node:test';
import { initializeTestEnvironment } from "@firebase/rules-unit-testing";
import { getFirestore, connectFirestoreEmulator, collection, query, where, getDoc } from "firebase/firestore";
import { initializeApp } from 'firebase/app';

//Unsure if this needs something else
const emulatorConfig = {
    projectId: "demo-test",
};

const firebaseApp = initializeApp(emulatorConfig);
//initializeApp has to be called before getFirestore
const mockDB = getFirestore();
connectFirestoreEmulator(mockDB, '127.0.0.1', 8080)

// Mock useIntersections
jest.mock('../src/app/hooks/useIntersections', () => ({
    useIntersections: jest.fn(),
}));

jest.mock('../FirebaseConfig', () => ({
    db: jest.fn( () => mockDB),
}));

const initialFormValues = {
    id: '',
    name: '',
    latitude: '',
    longitude: '',
    imagepath: 'https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg',
    status: '',
    timestamp: ''
}



describe("Add camera", () => {
    beforeEach(async () => {
        jest.clearAllMocks();
        let mockTestEnv = await initializeTestEnvironment({
            projectId: "demo-test",
            firestore: {host:"localhost", port:8080},
        });
        mockTestEnv.clearFirestore();
    });

    it("adds a new empty camera on empty submit", async () => {
        useIntersections.mockReturnValue([]);

        const {getByText} = render(<AddCamera />);

        const submitButton = getByText("ADD");
        fireEvent.click(submitButton);
        //i want to see that there is nothing stored
        //then when i click the button
        //there is one thing with initialFormValues in it

        const camerasRef = collection(mockDB, "cameras");

        /*this line to get a document doesn't work;
        I don't know how to turn a CollectionReference into a DocumentReference
        const addedCamera = await getDoc(camerasRef);*/

        //Untrue, but would at least tell me what camerasRef has
        expect(camerasRef).toEqual(initialFormValues);

    });

});