import { Button } from "flowbite-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { HiTrash } from "react-icons/hi";
import { setJwtToken } from "../../../../customFunction/setJwtToken";
import ErrorMessage from "../../../Shared/ErrorMessage/ErrorMessage";
import LoadingSpinner from "../../../Shared/LoadingSpinner/LoadingSpinner";

const Sellers = () => {
  const [load, setLoad] = useState(false);
  const [errorMessages, setErrorMessages] = useState("");
  const [sellers, setSellers] = useState([]);

  useEffect(() => {
    setLoad(true);
    const getSellers = async () => {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/users?role=seller`
      );
      const data = await res.json();

      if (data.success) {
        setSellers(data.data);
        setErrorMessages("");
      } else {
        setErrorMessages(data.error);
      }
      setLoad(false);
    };
    getSellers();
  }, []);

  const handleDeleteSeller = (id) => {
    toast.success(`Deleted ${id}`);
    setJwtToken("hasibul.pbn@gmail.com");
  };

  const handleSellerVerification = async (id) => {
    toast.success(`Verified seller ${id}`);

    const res = await fetch(
      `${process.env.REACT_APP_API_URL}/users/verify/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    const data = await res.json();
    if (data.success) {
      toast.success(data.message);
    } else {
      toast.error(data.error);
    }
  };

  const handleMakeAdmin = async (id) => {
    const res = await fetch(
      `${process.env.REACT_APP_API_URL}/users/admin/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    const data = await res.json();
    if (data.success) {
      toast.success(data.message);
    } else {
      toast.error(data.error);
    }
  };

  if (load) {
    return <LoadingSpinner />;
  }

  if (errorMessages) {
    return <ErrorMessage error={errorMessages} />;
  }

  return (
    <div className="px-5">
      <h4 className="mb-4 text-2xl font-semibold text-gray-600 dark:text-gray-300">
        All Sellers
      </h4>
      <div className="w-full overflow-hidden rounded-lg shadow-xs">
        <div className="w-full overflow-x-auto">
          <table className="w-full whitespace-no-wrap ">
            <thead>
              <tr className="text-xs font-semibold tracking-wide text-left text-gray-700 uppercase border-b dark:border-gray-700 bg-gray-300 dark:text-gray-400 dark:bg-black">
                <th className="px-4 py-3">Seller</th>
                <th className="px-4 py-3">phone</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-900">
              {sellers?.map((seller) => (
                <tr
                  className="text-gray-700 dark:text-gray-400"
                  key={seller?._id}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center text-sm">
                      {/* <!-- Avatar with inset shadow --> */}
                      <div className="relative hidden w-8 h-8 mr-3 rounded-full md:block">
                        <img
                          className="object-cover w-full h-full rounded-full"
                          src={seller?.image}
                          alt=""
                          loading="lazy"
                        />
                        <div
                          className="absolute inset-0 rounded-full shadow-inner"
                          aria-hidden="true"
                        ></div>
                      </div>
                      <div>
                        <p className="font-semibold">{seller?.name}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {seller?.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">{seller?.phone}</td>
                  <td className="px-4 py-3 text-xs">
                    <span
                      className={
                        seller?.isVerified
                          ? "px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-full dark:bg-green-700 dark:text-green-100"
                          : "px-2 py-1 font-semibold leading-tight text-orange-700 bg-orange-100 rounded-full dark:text-white dark:bg-orange-600"
                      }
                    >
                      {seller?.isVerified ? "Verified" : "Unverified"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">{seller?.joinDate}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-3 text-sm">
                      <button
                        className="flex items-center justify-between py-2 text-sm font-medium leading-5 text-blue-700 rounded-lg dark:text-gray-400 dark:hover:text-white hover:text-blue-900 focus:outline-none focus:shadow-outline-gray"
                        aria-label="Delete"
                        title="Delete This Seller"
                        onClick={() => handleDeleteSeller(seller?._id)}
                      >
                        <HiTrash className="w-5 h-5" />
                      </button>

                      <Button
                        onClick={() => handleSellerVerification(seller?._id)}
                        size="xs"
                        color="warning"
                        title={
                          seller?.isVerified
                            ? "This seller is already verified"
                            : "Make Verified Seller"
                        }
                        disabled={seller?.isVerified}
                      >
                        Verify
                      </Button>
                      <Button
                        onClick={() => handleMakeAdmin(seller?._id)}
                        size="xs"
                        color="failure"
                        title={
                          seller?.role === "admin"
                            ? "Already an Admin"
                            : "Change to Admin"
                        }
                        disabled={seller?.role === "admin" ? true : false}
                      >
                        Make Admin
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Sellers;
