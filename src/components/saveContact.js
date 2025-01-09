export const saveContactToDevice = (contactDetails) => {
    // Check if the browser supports Web Contact API
    if ('contacts' in navigator && 'ContactsManager' in window) {
        saveViaWebContactsAPI(contactDetails);
    }
    // Fallback for iOS and Android
    else if (isMobileDevice()) {
        saveViaFallbackMethods(contactDetails);
    }
    else {
        const contactString = `BEGIN:VCARD
VERSION:4.0
N:${contactDetails.businessName}
TITLE:${contactDetails.title}
ORG:${contactDetails.businessName}
ADR;TYPE=WORK:${contactDetails.address}
TEL:${contactDetails.primaryNumber}
TEL;TYPE=WORK:${contactDetails.secondaryNumber}
EMAIL;TYPE=WORK:${contactDetails.email}
URL:EMAIL:${contactDetails.email}
URL;TYPE=WORK:${contactDetails.website}
END:VCARD`;

        // Create a Blob with vCard data
        const blob = new Blob([contactString], { type: 'text/vcard' });

        // Create download link
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = `${contact.name}.vcf`;

        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        alert('Contact saving not supported on this device.');
    }
}

// Detect mobile device
const isMobileDevice = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Web Contacts API (Most modern approach)
const saveViaWebContactsAPI = async (contact) => {
    try {
        const contactProperties = [
            'name',
            'tel',
            'email',
            'address'
        ];

        const newContact = await navigator.contacts.select(contactProperties, { multiple: false });

        if (newContact) {
            navigator.contacts.save({
                name: contact.businessName,
                tel: contact.primaryNumber,
                email: contact.email,
                address: contact.address
            });
            alert('Contact saved successfully!');
        }
    } catch (error) {
        console.error('Web Contacts API Error:', error);
        saveViaFallbackMethods(contact);
    }
}

// Fallback methods for mobile browsers
const saveViaFallbackMethods = (contact) => {
    // iOS Safari method
    if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        saveContactForIOS(contact);
    }
    // Android Chrome method
    else if (/Android/i.test(navigator.userAgent)) {
        saveContactForAndroid(contact);
    }
    else {
        fallbackManualCopy(contact);
    }
}

// iOS Contact Saving (Pseudo-direct method)
const saveContactForIOS = (contact) => {
    // Create a temporary anchor to trigger iOS contact creation
    const anchorTag = document.createElement('a');
    anchorTag.href = `tel:${contact.phone}`;

    // Attempt to create contact via tel link
    const tempInput = document.createElement('input');
    tempInput.type = 'hidden';
    tempInput.value = JSON.stringify({
        name: contact.businessName,
        phone: contact.primaryNumber,
        email: contact.email,
        address: contact.address
    });

    document.body.appendChild(anchorTag);
    document.body.appendChild(tempInput);

    try {
        // Trigger iOS contact prompt
        anchorTag.click();
        console.log(contact);

        const contactString = `BEGIN:VCARD
VERSION:4.0
N:${contact.businessName}
TITLE:${contact.title}
ORG:${contact.businessName}
ADR;TYPE=WORK:${contact.address}
TEL:${contact.primaryNumber}
TEL;TYPE=WORK:${contact.secondaryNumber}
EMAIL;TYPE=WORK:${contact.email}
URL:EMAIL:${contact.email}
URL;TYPE=WORK:${contact.website}
END:VCARD`;

        // Create a Blob with vCard data
        const blob = new Blob([contactString], { type: 'text/vcard' });

        // Create download link
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = `${contact.name}.vcf`;

        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        alert('Please save the contact in the iOS prompt');
    } catch (error) {
        fallbackManualCopy(contact);
    }
}

// Android Contact Saving
const saveContactForAndroid = (contact) => {
    // Create a structured contact string
    const contactString = `BEGIN:VCARD
VERSION:4.0
N:${contact.businessName}
TITLE:${contact.title}
ORG:${contact.businessName}
ADR;TYPE=WORK:${contact.address}
TEL:${contact.primaryNumber}
TEL;TYPE=WORK:${contact.secondaryNumber}
EMAIL;TYPE=WORK:${contact.email}
URL:EMAIL:${contact.email}
URL;TYPE=WORK:${contact.website}
END:VCARD`;

    // Create a Blob with vCard data
    const blob = new Blob([contactString], { type: 'text/vcard' });

    // Create download link
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = `${contact.name}.vcf`;

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    alert('Download the .vcf file and save to contacts');
}

// Absolute last resort manual copy method
const fallbackManualCopy = (contact) => {
    const contactDetails = `Name: ${contact.name}\nPhone: ${contact.primaryNumber}\nEmail: ${contact.email}`;

    navigator.clipboard.writeText(contactDetails)
        .then(() => {
            alert('Contact details copied. Please manually save in your contacts app.');
        })
        .catch(err => {
            prompt('Unable to copy. Please manually copy these details:', contactDetails);
        });
}