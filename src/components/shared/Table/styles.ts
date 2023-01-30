import styled from 'styled-components'

///////////////////////////////////////////////////////////////////////////
//
// https://styled-components.com/docs/advanced#issues-with-specificity
//
// In a previous CSS version of <Table />, classNames were MERGED
// with those already used by the default <Table />. However, when
// using styled-components, the styled-components classNames have a
// higher specificity. This means that the CSS properties defined within
// styled-components will ultimately convert to classNames with a higher
// specificity than those of a global CSS stylesheet (e.g., Bootstrap, etc).
//
// However, we want the user to be able to pass in their own classes
// in order to overwrite the styled-components defaults.
// In order for this to happen, we could ensure that the
// user-defined classes have a higher specificity. However, that's
// sometimes a pain. Thus, this implemenation no longer merges classes.
// Instead, if a user passes in a particular className prop, it will
// ENTIRELY OVERWRITE the one used by the default implemenatation.
//
// The downside is that if the consumer just wants to tweak a style,
// they may end up having to rewrite a whole bunch of CSS that got
// wiped in the process. That's not good, but ultimately this implementation
// leads to the greatest possible flexibility for <Table /> consumption.
//
///////////////////////////////////////////////////////////////////////////

/* ======================
      Constants
====================== */
// These values are used in multiple places and are likely dependent on one's
// CSS theme. For that reason, they have been abstracted into constants.

// General Defaults:
// const textColor = '#333'
// const focusBoxShadowColor = '0 0 0 0.25rem rgba(13, 110, 253, 0.25)'
// const focusBorderColor = '#86b7fe'
// const checkboxColor = '#0d6efd'
// const pageLinkColor = '#0d6efd'
// const hoverPrimaryColor = 'rgb(13, 110, 253)'
// const hoverPrimaryBackground = '#cfe2ff'
// const exportCSVButtonColor = '#6c757d'
// const exportCSVButtonBackground = 'transparent'
// const exportCSVButtonBorderColor = '#ced4da'
// const exportCSVButtonHoverColor = '#fff'
// const exportCSVButtonHoverBackground = '#6c757d'
// const exportCSVButtonHoverBorderColor = '#6c757d'
// const exportCSVButtonFocusBorderColor = '#6c757d'
// const exportCSVButtonFocusBoxShadow = '0 0 0 0.25rem rgba(108, 117, 125, 0.5)'
// const exportCSVButtonActiveColor = '#fff'
// const exportCSVButtonActiveBorderColor = '#6c757d'
// const exportCSVButtonActiveBackground = '#6c757d'

// MainStem Defaults:
const textColor = '#333'
const focusBoxShadowColor = '0 0 0 0.25rem rgb(68, 0, 153, 0.25)'
const focusBorderColor = '#a280cc'
const checkboxColor = '#409'
const pageLinkColor = '#409'
const hoverPrimaryColor = '#409'
const hoverPrimaryBackground = '#f0ebf7'
const exportCSVButtonColor = '#409'
const exportCSVButtonBackground = 'transparent'
const exportCSVButtonBorderColor = '#409'
const exportCSVButtonHoverColor = '#fff'
const exportCSVButtonHoverBackground = '#409'
const exportCSVButtonHoverBorderColor = '#409'
const exportCSVButtonFocusBorderColor = '#409'
const exportCSVButtonFocusBoxShadow = '0 0 0 0.25rem rgb(68, 0, 153, 0.5)'
const exportCSVButtonActiveColor = '#fff'
const exportCSVButtonActiveBorderColor = '#409'
const exportCSVButtonActiveBackground = '#409'

/* ======================
    SCTableContainer
====================== */

export const SCTableContainer = styled.div`
  .ms-table-responsive {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    /* Hide scrollbar. This is particularly useful for avoiding the ugly scrollbar
    in Chrome for windows. Alternatively, one could build a custom scrollbar. */
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .ms-table-responsive::-webkit-scrollbar {
    display: none;
  }

  /* Originally, the styles were taken from Bootstrap 5, which uses a lot of 
  CSS custom properties in it's .table class. The problem with that is if a user 
  swaps out the tableClassName, then it ends up breaking the link between the
  .ms-table and associated nested classes that need those custom properties. One
  solution to this is to define all CSS variables at the level of SCTableContainer.
  However, I think it's probably just better to do away with the custom properties. */
  .ms-table {
    border-collapse: collapse;
    border-color: #dee2e6;
    box-sizing: border-box;
    caption-side: bottom;
    color: ${textColor};
    line-height: 1.5;
    vertical-align: top;
    width: 100%;
  }

  .ms-table * {
    box-sizing: border-box;
    line-height: 1.5;
  }

  .ms-table > :not(caption) > * > * {
    background-color: transparent;
    border-bottom-width: 1px;
    box-shadow: inset 0 0 0 9999px transparent;
    padding: 0.5rem 0.5rem;
  }

  .ms-table-thead {
    vertical-align: middle;
  }

  .ms-table-tbody {
    vertical-align: inherit;
  }

  .ms-table-tfoot {
    vertical-align: middle;
  }

  .ms-table-sm > :not(caption) > * > * {
    padding: 0.25rem 0.25rem;
  }

  .ms-table-bordered > :not(caption) > * {
    border-width: 1px 0;
  }

  .ms-table-bordered > :not(caption) > * > * {
    border-width: 0 1px;
  }

  .ms-table-borderless > :not(caption) > * > * {
    border-bottom-width: 0;
  }

  .ms-table-borderless > :not(:first-child) {
    border-top-width: 0;
  }

  .ms-table-striped
    > tbody
    > tr:nth-of-type(odd):not(.ms-table-selected-row)
    > * {
    background-color: rgba(0, 0, 0, 0.05);
    color: ${textColor};
  }

  .ms-table-hover > tbody > tr:hover:not(.ms-table-selected-row) > * {
    background-color: rgba(0, 0, 0, 0.09);
    color: ${textColor};
  }

  .ms-table-hover-primary > tbody > tr:hover:not(.ms-table-selected-row) > * {
    background-color: ${hoverPrimaryBackground};
    color: ${hoverPrimaryColor};
  }

  .ms-table-hover-primary > tbody > tr:hover:not(.ms-table-selected-row) {
    outline: 1px solid ${hoverPrimaryColor};
  }

  .ms-table-selected-row {
    border-color: #15c213;
  }

  .ms-table-selected-row th,
  .ms-table-selected-row td {
    background-color: rgb(157, 225, 150);
    border-color: #15c213; // Jest green.
    color: ${textColor};
  }

  /* .ms-table-group-divider {
    border-top: 2px solid #dee2e6;
  } */

  /* ======================
      .ms-table-flush
  ====================== */

  .ms-table-flush thead tr:first-child {
    border-top: none;
  }

  .ms-table-flush thead tr th:first-child,
  .ms-table-flush thead tr td:first-child {
    border-left: none;
  }

  .ms-table-flush thead tr th:last-child,
  .ms-table-flush thead tr td:last-child {
    border-right: none;
  }

  .ms-table-flush tbody:first-child tr:first-child {
    border-top: none;
  }

  .ms-table-flush tbody tr th:first-child,
  .ms-table-flush tbody tr td:first-child {
    border-left: none;
  }

  .ms-table-flush tbody tr th:last-child,
  .ms-table-flush tbody tr td:last-child {
    border-right: none;
  }

  .ms-table-flush tbody:last-child tr:last-child {
    border-bottom: none;
  }

  .ms-table-flush tfoot tr:last-child {
    border-bottom: none;
  }

  .ms-table-flush tfoot tr th:first-child,
  .ms-table-flush tfoot tr td:first-child {
    border-left: none;
  }

  .ms-table-flush tfoot tr th:last-child,
  .ms-table-flush tfoot tr td:last-child {
    border-right: none;
  }

  .ms-table-flush tfoot tr th,
  .ms-table-flush tfoot tr td {
    border-bottom: none;
  }

  /* ======================
  <input type='checkbox> styles
  ====================== */

  /* Used by Controls */
  .ms-table-form-check {
    display: block;
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
    padding-left: 1.5em;
  }

  /* Used by Controls */
  .ms-table-form-check .ms-table-form-check-input {
    float: left;
    margin-left: -1.5em;
  }

  .ms-table-form-check-input {
    -webkit-print-color-adjust: exact;
    appearance: none;
    background-color: #fff;
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    border: 1px solid rgba(0, 0, 0, 0.25);
    color-adjust: exact;
    height: 1em;
    margin-top: 0.25em;
    vertical-align: top;
    width: 1em;
  }

  .ms-table-form-check-input[type='checkbox'] {
    border-radius: 0.25em;
  }

  .ms-table-form-check-input:active {
    filter: brightness(90%);
  }

  .ms-table-form-check-input:focus {
    border-color: ${focusBorderColor};
    box-shadow: ${focusBoxShadowColor};
    outline: 0;
  }

  .ms-table-form-check-input:checked {
    background-color: ${checkboxColor};
    border-color: ${checkboxColor};
  }

  .ms-table-form-check-input:checked[type='checkbox'] {
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3e%3cpath fill='none' stroke='%23fff' stroke-linecap='round' stroke-linejoin='round' stroke-width='3' d='m6 10 3 3 6-6'/%3e%3c/svg%3e");
  }

  .ms-table-form-check-input[type='checkbox']:indeterminate {
    background-color: ${checkboxColor};
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3e%3cpath fill='none' stroke='%23fff' stroke-linecap='round' stroke-linejoin='round' stroke-width='3' d='M6 10h8'/%3e%3c/svg%3e");
    border-color: ${checkboxColor};
  }

  .ms-table-form-check-input:disabled {
    filter: none;
    opacity: 0.5;
    pointer-events: none;
  }

  .ms-table-form-check-inline {
    display: inline-block;
    margin-right: 16px;
  }

  /* ======================
  <input type='text'> styles
  ====================== */
  /* We may also need basic line-height, etc. */

  .ms-table-form-control {
    appearance: none;
    background-clip: padding-box;
    background-color: #fff;
    border: 1px solid #ced4da;
    border-radius: 4px;
    color: ${textColor};
    display: block;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.5;
    // min-width: 0px !important; /* Firefox ???*/
    padding: 4px 8px;
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    width: 100%;
    @media (prefers-reduced-motion: reduce) {
      transition: none;
    }
  }

  .ms-table-form-control:focus {
    background-color: #fff;
    border-color: ${focusBorderColor};
    box-shadow: ${focusBoxShadowColor};
    color: ${textColor};
    outline: 0;
  }

  .ms-table-form-control::-moz-placeholder {
    color: #6c757d;
    opacity: 1;
  }

  .ms-table-form-control::placeholder {
    color: #6c757d;
    opacity: 1;
  }

  /* ======================
      <select> styles
  ====================== */
  /* Used for selection of results per page in pagination controls. */

  .ms-table-form-select {
    appearance: none;
    background-color: #fff;

    /* The !important flag set on background-image and background-position. Why?
    This allows the consumer to pass in Bootstrap's 'form-select form-select-sm'
    without reverting bact to oversized, incorrectly-positioned background-image. */
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3e%3cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3e%3c/svg%3e") !important;
    background-position: 100% 80% !important;
    background-repeat: no-repeat;
    background-size: 16px 12px;
    border: 1px solid #ced4da;
    border-radius: 4px;
    color: ${textColor};
    display: block;
    font-family: inherit;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.5;
    margin: 0;
    padding-bottom: 4px;
    padding-left: 8px;
    padding-right: 8px;
    padding-top: 4px;
    text-transform: none;
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    width: 100%;
    word-wrap: normal;

    @media (prefers-reduced-motion: reduce) {
      transition: none;
    }
  }

  .ms-table-form-select:focus {
    border-color: ${focusBorderColor};
    box-shadow: ${focusBoxShadowColor};
    outline: 0;
  }

  .ms-table-form-select[size]:not([size='1']) {
    background-image: none;
    padding-right: 12px;
  }

  .ms-table-form-select:-moz-focusring {
    color: transparent;
    text-shadow: 0 0 0 ${textColor};
  }

  /* ======================
      Pagination styles
  ====================== */

  .ms-table-pagination {
    display: flex;
    list-style: none;
    padding-left: 0;
    user-select: none;
  }

  .ms-table-page-link {
    background-color: #fff;
    border: 1px solid #dee2e6;
    color: ${pageLinkColor};
    display: block;
    font-size: 14px;
    padding: 4px 8px;
    position: relative;
    text-decoration: none;
    transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
      border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

    @media (prefers-reduced-motion: reduce) {
      transition: none;
    }
  }

  .ms-table-page-link:hover {
    background-color: #e9ecef;
    border-color: #dee2e6;
    color: ${pageLinkColor};
    z-index: 2;
  }

  .ms-table-page-link:focus {
    border-color: ${focusBorderColor};
    box-shadow: ${focusBoxShadowColor};
    color: ${pageLinkColor};
    outline: 0;
    z-index: 3;
  }

  .ms-table-page-link.active,
  .active > .ms-table-page-link {
    background-color: ${pageLinkColor};
    border-color: ${pageLinkColor};
    color: #fff;
    z-index: 3;
  }

  .ms-table-page-link.disabled,
  .disabled > .ms-table-page-link {
    background-color: #fff;
    border-color: #dee2e6;
    color: #6c757d;
    pointer-events: none;
  }

  .ms-table-page-item:not(:first-child) .ms-table-page-link {
    margin-left: -1px;
  }

  .ms-table-page-item:first-child .ms-table-page-link {
    border-bottom-left-radius: 4px;
    border-top-left-radius: 4px;
  }

  .ms-table-page-item:last-child .ms-table-page-link {
    border-bottom-right-radius: 4px;
    border-top-right-radius: 4px;
  }

  .ms-table-user-select-none {
    user-select: none !important;
  }

  /* ======================
    ExporstCSVButton styles
  ====================== */

  .ms-table-export-csv-button {
    background-color: ${exportCSVButtonBackground};
    border: 1px solid ${exportCSVButtonBorderColor};
    border-radius: 4px;
    color: ${exportCSVButtonColor};
    cursor: pointer;
    display: inline-block;
    font-size: 12px;
    font-weight: 400;
    line-height: 1.5;
    min-height: 31px;
    padding: 4px 8px;
    text-align: center;
    text-decoration: none;
    transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
      border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    user-select: none;
    vertical-align: middle;
  }

  .ms-table-export-csv-button:hover {
    background-color: ${exportCSVButtonHoverBackground};
    border-color: ${exportCSVButtonHoverBorderColor};
    color: ${exportCSVButtonHoverColor};
  }

  .ms-table-export-csv-button:focus {
    border-color: ${exportCSVButtonFocusBorderColor};
    box-shadow: ${exportCSVButtonFocusBoxShadow};
  }

  .ms-table-export-csv-button:active {
    background-color: ${exportCSVButtonActiveBackground};
    border-color: ${exportCSVButtonActiveBorderColor};
    color: ${exportCSVButtonActiveColor};
  }

  .ms-table-export-csv-button:active:focus {
    box-shadow: ${exportCSVButtonFocusBoxShadow};
  }

  .ms-table-export-csv-button:disabled {
    background-color: transparent;
    color: #6c757d;
  }
`
