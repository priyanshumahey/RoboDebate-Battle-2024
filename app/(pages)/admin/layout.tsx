"use client"

import React from 'react';

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col justify-center min-h-[100vh]">
            <div className="flex flex-row justify-center">
                <main>{children}</main>
            </div>
        </div>
    );
}
