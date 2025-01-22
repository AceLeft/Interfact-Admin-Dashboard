import '@testing-library/jest-dom';
import { render, screen, fireEvent, within, getByRole, getByText } from '@testing-library/react';
import React from 'react';
import AddCamera from '../src/app/add_camera/page.tsx'
import { useIntersections } from '../src/app/hooks/useIntersections';
import { useUserFeedback } from '../src/app/hooks/useUserFeedback';
import { describe } from 'node:test';
import { expect } from '@jest/globals';
import { db } from '../FirebaseConfig.ts';


// Mock useIntersections
jest.mock('../src/app/hooks/useIntersections', () => ({
    useIntersections: jest.fn(),
}));

jest.mock('../FirebaseConfig.ts', () => ({
    db: jest.fn(),
}));
// Cache original functionality (for mocking setFormData)
const realUseState = React.useState

const initialFormValues = {
    id: '',
    name: '',
    latitude: '',
    longitude: '',
    imagepath: 'https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg',
    status: '',
    timestamp: ''
}

//i really don't know...

describe("Add camera", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("adds a new empty camera on empty submit", () => {
        useIntersections.mockReturnValue([]);

        const {getByText} = render(<AddCamera />);

        const submitButton = getByText("ADD");
        fireEvent.click(submitButton);
        //i want to see that there is nothing in useIntersections
        //then when i click the button
        //there is one thing with initialFormValues in it

    });

    it("adds camera with data on submit", () => {


        // Mock useState before rendering your component
        jest
        .spyOn(React, 'useState')
        .mockImplementationOnce(() => realUseState(initialFormValues));
    })

});