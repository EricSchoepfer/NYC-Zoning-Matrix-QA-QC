/* ==========================================================================
   NYC Custom Zoning Matrix Builder - Layout Additions (style.css)
   ========================================================================== */

label {
    font-size: 0.8rem;
    font-weight: bold;
    color: var(--primary-color);
    display: block;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 4px;
}

input[type="number"] {
    width: 100%;
    padding: 12px;
    border: 2px solid var(--border-color);
    border-radius: 4px;
    font-size: 1rem;
    box-sizing: border-box;
    outline: none;
    background-color: #ffffff;
    transition: border-color 0.2s ease-in-out;
}

input[type="number"]:focus {
    border-color: var(--accent-color);
}

/* Checkbox Label Configurations */
label input[type="checkbox"] {
    margin-right: 8px;
    transform: scale(1.1);
    vertical-align: middle;
    cursor: pointer;
}

/* Animations for Smooth Retrieve Interactions */
#matrixOutputWrapper {
    animation: matrixFadeIn 0.35s ease-in-out forwards;
}

@keyframes matrixFadeIn {
    from {
        opacity: 0;
        transform: translateY(8px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Media Query Rule to Ensure Split Screen Stacks Cleanly on Smaller Laptops */
@media (max-width: 900px) {
    #matrixOutputWrapper .search-grid {
        grid-template-columns: 1fr !important;
    }
    #matrixOutputWrapper div[style*="position: sticky"] {
        position: static !important;
        margin-top: 20px;
    }
}
