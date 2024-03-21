import React from "react";
import { HomePage } from "../HomePage";
import { CreatePage } from "../CreatePage";
import { Route, Routes } from "react-router";

export const MyPage = () => (
    <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/create" element={<CreatePage />} />
    </Routes>
);
