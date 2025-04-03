import axios from "axios";

export const usePinata = () => {
    const uploadFileToIpfs = async (file : File) => {
        try{
            const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
            const form = new FormData();
            form.append("file", file);
            // Proper JSON formatting
            const metadata = JSON.stringify({ name: file.name });
            const options = JSON.stringify({ cidVersion: 1 });

            form.append("pinataMetadata", metadata);
            form.append("pinataOptions", options);
           
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`, 
                },
                body: form, 
            });

            const response = await res.json();
            console.log("File uploaded to IPFS:", response);

            return {
               success: true,
               pinataURL: "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash
           }; 

        } catch (err) {
            console.error("Error uploading file to IPFS:", err);
        }
    };

    const uploadJsonToIpfs = async (data : any) => {
        try{
            const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
            
            const response = await axios.post(url , data , {
                headers:{
                    Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
                }
            })
            console.log("File uploaded to IPFS:", response.data);
            return {
                success: true,
                pinataURL: "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash
            }
        } catch (err) {
            console.error("Error uploading file to IPFS:", err);
            return {
                success: false,
                message: err,
            }
        }
    };
    return {uploadFileToIpfs , uploadJsonToIpfs}
}