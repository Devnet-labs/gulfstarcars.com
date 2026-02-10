import Link from 'next/link';
import { prisma } from '@/lib/db';
import { Plus, Pencil } from 'lucide-react';
import DeleteCarButton from '@/components/admin/DeleteCarButton';
import { FormattedDate } from '@/components/FormattedDate';

interface Car {
    id: string;
    customId: string | null;
    make: string;
    model: string;
    year: number;
    price: number;
    images: string[];
    description: string;
    condition: string;
    bodyType: string | null;
    fuelType: string | null;
    mileage: number | null;
    steering: string | null;
    transmission: string | null;
    status: string;
    createdAt: Date;
    engineCapacity: string | null;
    colour: string | null;
    driveType: string | null;
    doors: number | null;
    seats: number | null;
    location: string | null;
}

export default async function AdminCarsPage() {
    let cars: Car[] = [];
    try {
        const dbCars = await prisma.car.findMany({
            orderBy: { createdAt: 'desc' },
        });
        // Map to ensure all fields are present
        cars = dbCars.map(car => ({
            id: car.id,
            customId: car.customId,
            make: car.make,
            model: car.model,
            year: car.year,
            price: car.price,
            images: car.images,
            description: car.description,
            condition: car.condition,
            bodyType: car.bodyType,
            fuelType: car.fuelType,
            mileage: car.mileage,
            steering: car.steering,
            transmission: car.transmission,
            status: car.status,
            createdAt: car.createdAt,
            engineCapacity: car.engineCapacity,
            colour: car.colour,
            driveType: car.driveType,
            doors: car.doors,
            seats: car.seats,
            location: car.location,
        }));
    } catch (e) {
        console.warn("DB not connected, using empty list or mock");
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Manage Cars</h1>
                <Link
                    href="/admin/cars/new"
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                    <Plus className="h-4 w-4" />
                    Add Car
                </Link>
            </div>

            <div className="rounded-xl border border-white/5 bg-card/40 backdrop-blur-xl shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full caption-bottom text-sm text-left">
                        <thead className="[&_tr]:border-b border-white/5 bg-white/5">
                            <tr className="border-b border-white/5 transition-colors">
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Image</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Stock ID</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Make & Model</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Year</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Price</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Condition</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Status</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Mileage</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Fuel</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Trans.</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Body</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Engine</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Colour</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Drive</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Location</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Created</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right sticky right-0 bg-card/95 backdrop-blur-sm">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {cars.length === 0 ? (
                                <tr>
                                    <td colSpan={17} className="p-8 text-center text-muted-foreground">
                                        No cars found in database. Add one to get started.
                                    </td>
                                </tr>
                            ) : (
                                cars.map((car) => (
                                    <tr key={car.id} className="border-b border-white/5 transition-colors hover:bg-white/5">
                                        <td className="p-4 align-middle">
                                            <div className="h-10 w-16 overflow-hidden rounded bg-secondary">
                                                <img src={car.images[0] || '/placeholder-car.png'} alt={car.model} className="h-full w-full object-cover" />
                                            </div>
                                        </td>
                                        <td className="p-4 align-middle">
                                            <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-bold text-primary ring-1 ring-inset ring-primary/20 whitespace-nowrap">
                                                {car.customId || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="p-4 align-middle">
                                            <div className="font-medium text-foreground">{car.make}</div>
                                            <div className="text-xs text-muted-foreground">{car.model}</div>
                                        </td>
                                        <td className="p-4 align-middle text-muted-foreground">{car.year}</td>
                                        <td className="p-4 align-middle text-emerald-400 font-medium">${car.price.toLocaleString()}</td>
                                        <td className="p-4 align-middle">
                                            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${car.condition === 'New' ? 'bg-blue-400/10 text-blue-400 ring-blue-400/20' : 'bg-orange-400/10 text-orange-400 ring-orange-400/20'}`}>
                                                {car.condition}
                                            </span>
                                        </td>
                                        <td className="p-4 align-middle">
                                            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${car.status === 'AVAILABLE' ? 'bg-green-400/10 text-green-400 ring-green-400/20' : 'bg-red-400/10 text-red-400 ring-red-400/20'}`}>
                                                {car.status}
                                            </span>
                                        </td>
                                        <td className="p-4 align-middle text-muted-foreground whitespace-nowrap">{car.mileage ? `${car.mileage.toLocaleString()} km` : '-'}</td>
                                        <td className="p-4 align-middle text-muted-foreground">{car.fuelType || '-'}</td>
                                        <td className="p-4 align-middle text-muted-foreground">{car.transmission || '-'}</td>
                                        <td className="p-4 align-middle text-muted-foreground">{car.bodyType || '-'}</td>
                                        <td className="p-4 align-middle text-muted-foreground">{car.engineCapacity || '-'}</td>
                                        <td className="p-4 align-middle text-muted-foreground">{car.colour || '-'}</td>
                                        <td className="p-4 align-middle text-muted-foreground">{car.driveType || '-'}</td>
                                        <td className="p-4 align-middle text-muted-foreground">{car.location || '-'}</td>
                                        <td className="p-4 align-middle text-muted-foreground whitespace-nowrap">
                                            {car.createdAt ? <FormattedDate date={car.createdAt} /> : '-'}
                                        </td>
                                        <td className="p-4 align-middle text-right sticky right-0 bg-card/95 backdrop-blur-sm border-l border-white/5">
                                            <div className="flex justify-end gap-2">
                                                <Link
                                                    href={`/admin/cars/${car.id}/edit`}
                                                    className="p-2 hover:bg-primary/20 hover:text-primary rounded transition-colors text-muted-foreground inline-flex"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Link>
                                                <DeleteCarButton id={car.id} />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

    );
}
