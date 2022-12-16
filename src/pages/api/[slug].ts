import type { ParsedUrlQuery } from "querystring";
import { prisma } from "../../server/db/client";
import type { NextApiHandler } from "next";

interface UrlQuery extends ParsedUrlQuery {
    slug: string;
}

const handler: NextApiHandler = async (req, res) => {
    const { slug } = req.query as UrlQuery;

    const data = await prisma.shortUrl.findUnique({ where: { slug } });

    if (!data) {
        return res.status(404).json({ message: "Not found" });
    }

    if (!data?.url.startsWith("https://") && !data?.url.startsWith("http://")) {
        return res.redirect(`https://${data?.url}`);
    }

    return res.redirect(data?.url ?? "/");
};

export default handler;
