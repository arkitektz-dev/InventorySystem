// 1. Help the user select a place
// 2. Retrieve the address components associated with that place
// 3. Populate the form fields with those address components.
// This requires the Places library, Maps JavaScript API.
// Include the libraries=places parameter when you first load the API.
// For example: <script
// src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">
let autocomplete;
let address1Field;
let address2Field;
let postalField;

function initAutocomplete() {
    address1Field = document.querySelector("#Address");
    address2Field = document.querySelector("#Street");
    postalField = document.querySelector("#PostalCode");
    // Create the autocomplete object, restricting the search predictions to
    // addresses in the US and Canada.
    autocomplete = new google.maps.places.Autocomplete(address1Field, {
        componentRestrictions: { country: ["nz"] },
        fields: ["address_components", "geometry"],
        types: ["address"],
    });
    address1Field.focus();
    // When the user selects an address from the drop-down, populate the
    // address fields in the form.
    autocomplete.addListener("place_changed", fillInAddress);
}

function fillInAddress() {
    // Get the place details from the autocomplete object.
    const place = autocomplete.getPlace();
    let address1 = "";
    let postcode = "";

    // Get each component of the address from the place details,
    // and then fill-in the corresponding field on the form.
    // place.address_components are google.maps.GeocoderAddressComponent objects
    // which are documented at http://goo.gle/3l5i5Mr
    for (const component of place.address_components) {
        const componentType = component.types[0];

        //console.log(componentType);
        console.log(component);

        switch (componentType) {
            case "street_number": {
                address1 = `${component.long_name} ${address1}`;
                break;
            }

            case "sublocality_level_1": {
                if (document.querySelector("#State") != null) {
                    document.querySelector("#State").value = component.short_name;
                }
                break;
            }

            case "route": {
                address1 += component.short_name;
                break;
            }



            case "postal_code": {
                postcode = `${component.long_name}${postcode}`;
                break;
            }

            case "postal_code_suffix": {
                postcode = `${postcode}-${component.long_name}`;
                break;
            }
            case "locality":
                document.querySelector("#City").value = component.long_name;
                break;
            case "administrative_area_level_1": {
                if (document.querySelector("#State") != null) {
                    //document.querySelector("#State").value = component.short_name;
                }
                break;
            }
            case "country":
                var dropdown = document.querySelector("#Country");
                dropdown.selectedIndex = [...dropdown.options].findIndex(option => option.text === component.long_name);
                break;
        }
    }

    address1Field.value = address1;
    if (postalField != null) {
        postalField.value = postcode;
    }
    // After filling the form with address components from the Autocomplete
    // prediction, set cursor focus on the second address line to encourage
    // entry of subpremise information such as apartment, unit, or floor number.
    if (address2Field != null) {
        address2Field.focus();
    }
}
